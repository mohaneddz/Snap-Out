const newSiteInput = document.getElementById('newSite');
const addBtn = document.getElementById('addBtn');
const sitesList = document.getElementById('sitesList');
const status = document.getElementById('status');
const sitesCount = document.getElementById('sitesCount');
let blockedSites = [];
let statusTimer;

function renderSites() {
  sitesCount.textContent = blockedSites.length;
  sitesList.replaceChildren();
  if (!blockedSites.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No blocked websites yet. Add one above to get started!';
    sitesList.append(empty);
    return;
  }

  for (const site of blockedSites) {
    const row = document.createElement('li');
    const label = document.createElement('span');
    const remove = document.createElement('button');
    label.textContent = `🔒 ${site}`;
    remove.type = 'button';
    remove.className = 'delete-btn';
    remove.textContent = 'Remove';
    remove.dataset.site = site;
    remove.setAttribute('aria-label', `Remove ${site}`);
    row.append(label, remove);
    sitesList.append(row);
  }
}

async function loadSites() {
  try {
    const result = await chrome.storage.sync.get('blockedSites');
    blockedSites = [...new Set((Array.isArray(result.blockedSites) ? result.blockedSites : []).map(SnapOut.normalizeDomain).filter(Boolean))];
    renderSites();
  } catch (error) {
    showStatus(`Could not load websites: ${error.message}`, false);
  }
}

async function saveSites(next, successMessage) {
  addBtn.disabled = true;
  try {
    await chrome.storage.sync.set({ blockedSites: next });
    const result = await chrome.runtime.sendMessage({ type: 'refreshRules' });
    if (!result?.success) throw new Error(result?.error || 'Chrome could not update the block rules.');
    blockedSites = next;
    renderSites();
    showStatus(successMessage, true);
  } catch (error) {
    showStatus(`Could not save websites: ${error.message}`, false);
  } finally {
    addBtn.disabled = false;
  }
}

addBtn.addEventListener('click', async () => {
  const site = SnapOut.normalizeDomain(newSiteInput.value);
  if (!site) return showStatus('Enter a valid website domain or URL.', false);
  if (blockedSites.includes(site)) return showStatus('Website already in the list.', false);
  await saveSites([...blockedSites, site], 'Website added.');
  if (blockedSites.includes(site)) newSiteInput.value = '';
});

newSiteInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') addBtn.click();
});

sitesList.addEventListener('click', async event => {
  const site = event.target.closest('button[data-site]')?.dataset.site;
  if (site) await saveSites(blockedSites.filter(item => item !== site), 'Website removed.');
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.blockedSites) loadSites();
});

function showStatus(message, isSuccess) {
  clearTimeout(statusTimer);
  status.textContent = message;
  status.className = `status show ${isSuccess ? 'success' : 'error'}`;
  statusTimer = setTimeout(() => status.classList.remove('show'), 5000);
}

loadSites();
