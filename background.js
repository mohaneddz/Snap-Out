importScripts('shared.js');

const BLOCK_PAGE = chrome.runtime.getURL('block.html');
let ruleUpdate = Promise.resolve();
let approvalUpdate = Promise.resolve();
let historyUpdate = Promise.resolve();

async function updateBlockRules() {
  const { blockedSites = [] } = await chrome.storage.sync.get('blockedSites');
  const domains = [...new Set((Array.isArray(blockedSites) ? blockedSites : []).map(SnapOut.normalizeDomain).filter(Boolean))];
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map(rule => rule.id),
    addRules: domains.map((domain, index) => ({
      id: index + 1,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: { regexSubstitution: `${BLOCK_PAGE}#\\0` }
      },
      condition: {
        regexFilter: SnapOut.domainRegex(domain),
        resourceTypes: ['main_frame']
      }
    }))
  });
}

function scheduleRuleUpdate() {
  ruleUpdate = ruleUpdate.catch(() => {}).then(updateBlockRules);
  return ruleUpdate;
}

// Rules survive worker suspension. Reconcile them on install, browser startup,
// and synced settings changes (including changes from another device).
chrome.runtime.onInstalled.addListener(() => { scheduleRuleUpdate().catch(console.error); });
chrome.runtime.onStartup.addListener(() => { scheduleRuleUpdate().catch(console.error); });
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.blockedSites) {
    scheduleRuleUpdate().catch(console.error);
    approvalUpdate = approvalUpdate.catch(() => {}).then(async () => {
      const rules = await chrome.declarativeNetRequest.getSessionRules();
      if (rules.length) await chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds: rules.map(rule => rule.id) });
    });
    approvalUpdate.catch(console.error);
  }
});

async function grantTabForDomain(tabId, domain) {
  const existing = await chrome.declarativeNetRequest.getSessionRules();
  const old = existing.filter(rule => rule.condition.tabIds?.includes(tabId));
  const id = Math.max(10000, ...existing.map(rule => rule.id)) + 1;
  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: old.map(rule => rule.id),
    addRules: [{
      id,
      priority: 2,
      action: { type: 'allow' },
      condition: {
        regexFilter: SnapOut.domainRegex(domain),
        resourceTypes: ['main_frame'],
        tabIds: [tabId]
      }
    }]
  });
}

async function revokeTab(tabId) {
  const rules = await chrome.declarativeNetRequest.getSessionRules();
  const removeRuleIds = rules.filter(rule => rule.condition.tabIds?.includes(tabId)).map(rule => rule.id);
  if (removeRuleIds.length) await chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds });
}

chrome.tabs.onRemoved.addListener(tabId => {
  approvalUpdate = approvalUpdate.catch(() => {}).then(() => revokeTab(tabId));
  approvalUpdate.catch(console.error);
});

async function recordVisit(url, reason) {
  const { visitHistory = [] } = await chrome.storage.local.get('visitHistory');
  const history = [{ url, reason, timestamp: new Date().toISOString() }, ...(Array.isArray(visitHistory) ? visitHistory : [])].slice(0, 1000);
  await chrome.storage.local.set({ visitHistory: history });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'refreshRules' && sender.id === chrome.runtime.id) {
    scheduleRuleUpdate().then(
      () => sendResponse({ success: true }),
      error => sendResponse({ success: false, error: error.message })
    );
    return true;
  }
  if (message?.type !== 'continueToSite') return;

  const task = async () => {
    const tabId = sender.tab?.id;
    const source = sender.url || '';
    const target = source.startsWith(`${BLOCK_PAGE}#`) ? source.slice(BLOCK_PAGE.length + 1) : '';
    const reason = typeof message.reason === 'string' ? message.reason.trim() : '';
    const url = SnapOut.parseWebUrl(target);
    if (!Number.isInteger(tabId) || !url || !reason || reason.length > 500) {
      throw new Error('This visit could not be verified. Please reload the page.');
    }

    await ruleUpdate;
    const { blockedSites = [] } = await chrome.storage.sync.get('blockedSites');
    const domain = (Array.isArray(blockedSites) ? blockedSites : []).map(SnapOut.normalizeDomain).find(site => site && SnapOut.matchesDomain(url.hostname, site));
    if (!domain) throw new Error('This site is no longer in your blocked list.');

    approvalUpdate = approvalUpdate.catch(() => {}).then(() => grantTabForDomain(tabId, domain));
    await approvalUpdate;
    historyUpdate = historyUpdate.catch(() => {}).then(() => recordVisit(url.href, reason));
    try {
      await historyUpdate;
    } catch (error) {
      approvalUpdate = approvalUpdate.catch(() => {}).then(() => revokeTab(tabId));
      await approvalUpdate;
      throw error;
    }
    return { success: true, url: url.href };
  };

  task().then(sendResponse, error => sendResponse({ success: false, error: error.message }));
  return true;
});

scheduleRuleUpdate().catch(console.error);
