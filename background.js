let blockedSites = [];
let pendingNavigations = new Map();
let grantedTabs = new Set(); // Track tabs with granted access

// Load blocked sites from storage
chrome.storage.sync.get(['blockedSites'], (result) => {
  blockedSites = result.blockedSites || [];
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedSites) {
    blockedSites = changes.blockedSites.newValue || [];
  }
});

// Check if URL matches any blocked site
function isBlocked(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/^www\./, '');
    return blockedSites.some(site => {
      const cleanSite = site.replace(/^www\./, '').toLowerCase();
      return hostname.toLowerCase().includes(cleanSite);
    });
  } catch {
    return false;
  }
}

// Intercept navigation
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return; // Only handle main frame
  
  const url = details.url;
  const tabId = details.tabId;
  
  // Skip if tab has been granted access
  if (grantedTabs.has(tabId)) {
    return;
  }
  
  if (isBlocked(url) && !url.includes('chrome-extension://')) {
    pendingNavigations.set(tabId, url);
    chrome.tabs.update(tabId, {
      url: chrome.runtime.getURL('block.html') + '?url=' + encodeURIComponent(url)
    });
  }
});

// Clean up when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  pendingNavigations.delete(tabId);
  grantedTabs.delete(tabId);
});

// Handle messages from block page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'saveReason') {
    const { url, reason, tabId } = message;
    
    // Remove from pending navigations and grant access to this tab
    if (tabId !== undefined) {
      pendingNavigations.delete(tabId);
      grantedTabs.add(tabId); // Grant access for this tab session
    }
    
    // Save to history
    chrome.storage.local.get(['visitHistory'], (result) => {
      const history = result.visitHistory || [];
      history.unshift({
        url: url,
        reason: reason,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 1000 entries
      if (history.length > 1000) {
        history.length = 1000;
      }
      
      chrome.storage.local.set({ visitHistory: history }, () => {
        sendResponse({ success: true });
      });
    });
    
    return true; // Will respond asynchronously
  }
  
  if (message.type === 'getPendingUrl') {
    const url = pendingNavigations.get(sender.tab.id);
    sendResponse({ url: url });
    return true;
  }
});
