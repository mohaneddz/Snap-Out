const historyList = document.getElementById('historyList');
const viewAllBtn = document.getElementById('viewAllBtn');
const settingsBtn = document.getElementById('settingsBtn');

function loadHistory() {
  chrome.storage.local.get(['visitHistory'], (result) => {
    const history = result.visitHistory || [];
    renderHistory(history);
  });
}

function extractDomainName(url) {
  try {
    const urlObj = new URL(url);
    let domain = urlObj.hostname;
    
    // Remove www.
    domain = domain.replace(/^www\./, '');
    
    // Remove TLD (.com, .org, etc.)
    const parts = domain.split('.');
    if (parts.length > 1) {
      return parts[0];
    }
    return domain;
  } catch {
    return url;
  }
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

function renderHistory(history) {
  if (history.length === 0) {
    const noHistory = document.createElement('div');
    noHistory.className = 'no-history';
    noHistory.textContent = 'No visits recorded yet';
    historyList.textContent = '';
    historyList.appendChild(noHistory);
    return;
  }
  
  // Show only last 3 entries
  const recentHistory = history.slice(0, 3);
  
  historyList.textContent = '';
  
  recentHistory.forEach(item => {
    const domainName = extractDomainName(item.url);
    const timeAgo = formatTime(item.timestamp);
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'history-item';
    
    const urlDiv = document.createElement('div');
    urlDiv.className = 'history-url';
    urlDiv.textContent = domainName;
    itemDiv.appendChild(urlDiv);
    
    const reasonDiv = document.createElement('div');
    reasonDiv.className = 'history-reason';
    reasonDiv.textContent = `"${item.reason}"`;
    itemDiv.appendChild(reasonDiv);
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'history-time';
    timeDiv.textContent = timeAgo;
    itemDiv.appendChild(timeDiv);
    
    historyList.appendChild(itemDiv);
  });
}

viewAllBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('history.html') });
});

settingsBtn.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

loadHistory();
