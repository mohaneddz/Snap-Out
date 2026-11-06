const historyList = document.getElementById('historyList');
const viewAllBtn = document.getElementById('viewAllBtn');
const settingsBtn = document.getElementById('settingsBtn');

function loadHistory() {
  chrome.storage.local.get(['visitHistory'], (result) => {
    if (chrome.runtime.lastError) {
      historyList.textContent = 'Could not load visit history.';
      return;
    }
    const history = Array.isArray(result.visitHistory) ? result.visitHistory : [];
    renderHistory(history);
  });
}

function extractDomainName(url) {
  try {
    const urlObj = new URL(url);
    let domain = urlObj.hostname;
    
    return domain.replace(/^www\./, '');
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
  historyList.replaceChildren();
  if (history.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'no-history';
    empty.textContent = 'No visits recorded yet';
    historyList.append(empty);
    return;
  }
  
  // Show only last 3 entries
  const recentHistory = history.slice(0, 3);
  
  for (const item of recentHistory) {
    const row = document.createElement('div');
    row.className = 'history-item';
    for (const [className, value] of [
      ['history-url', extractDomainName(item.url)],
      ['history-reason', `“${item.reason}”`],
      ['history-time', formatTime(item.timestamp)]
    ]) {
      const field = document.createElement('div');
      field.className = className;
      field.textContent = value;
      row.append(field);
    }
    historyList.append(row);
  }
}

viewAllBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('history.html') });
});

settingsBtn.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

loadHistory();
