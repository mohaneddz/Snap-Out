const historyList = document.getElementById('historyList');
const clearBtn = document.getElementById('clearBtn');
const totalVisitsEl = document.getElementById('totalVisits');
const todayVisitsEl = document.getElementById('todayVisits');
const weekVisitsEl = document.getElementById('weekVisits');

function loadHistory() {
  chrome.storage.local.get(['visitHistory'], (result) => {
    const history = result.visitHistory || [];
    renderHistory(history);
    updateStats(history);
  });
}

function extractDomainName(url) {
  try {
    const urlObj = new URL(url);
    let domain = urlObj.hostname;
    domain = domain.replace(/^www\./, '');
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
  return date.toLocaleString();
}

function updateStats(history) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  totalVisitsEl.textContent = history.length;
  todayVisitsEl.textContent = history.filter(item => new Date(item.timestamp) >= todayStart).length;
  weekVisitsEl.textContent = history.filter(item => new Date(item.timestamp) >= weekStart).length;
}

function renderHistory(history) {
  if (history.length === 0) {
    historyList.innerHTML = '<div class="no-history">No visits recorded yet</div>';
    return;
  }
  
  historyList.innerHTML = '';
  
  history.forEach(item => {
    const domainName = extractDomainName(item.url);
    const formattedTime = formatTime(item.timestamp);
    
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const urlDiv = document.createElement('div');
    urlDiv.className = 'history-url';
    urlDiv.textContent = domainName;
    
    const fullUrlDiv = document.createElement('div');
    fullUrlDiv.className = 'history-full-url';
    fullUrlDiv.textContent = item.url;
    
    const reasonDiv = document.createElement('div');
    reasonDiv.className = 'history-reason';
    reasonDiv.textContent = `"${item.reason}"`;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'history-time';
    timeDiv.textContent = formattedTime;
    
    historyItem.appendChild(urlDiv);
    historyItem.appendChild(fullUrlDiv);
    historyItem.appendChild(reasonDiv);
    historyItem.appendChild(timeDiv);
    
    historyList.appendChild(historyItem);
  });
}

clearBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all visit history? This cannot be undone.')) {
    chrome.storage.local.set({ visitHistory: [] }, () => {
      loadHistory();
    });
  }
});

loadHistory();
