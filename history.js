const historyList = document.getElementById('historyList');
const clearBtn = document.getElementById('clearBtn');
const totalVisitsEl = document.getElementById('totalVisits');
const todayVisitsEl = document.getElementById('todayVisits');
const weekVisitsEl = document.getElementById('weekVisits');

function loadHistory() {
  chrome.storage.local.get(['visitHistory'], (result) => {
    if (chrome.runtime.lastError) {
      historyList.textContent = 'Could not load visit history.';
      return;
    }
    const history = Array.isArray(result.visitHistory) ? result.visitHistory : [];
    renderHistory(history);
    updateStats(history);
  });
}

function extractDomainName(url) {
  try {
    const urlObj = new URL(url);
    let domain = urlObj.hostname;
    domain = domain.replace(/^www\./, '');
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
  historyList.replaceChildren();
  if (history.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'no-history';
    empty.textContent = 'No visits recorded yet';
    historyList.append(empty);
    return;
  }
  
  for (const item of history) {
    const row = document.createElement('div');
    row.className = 'history-item';
    for (const [className, value] of [
      ['history-url', extractDomainName(item.url)],
      ['history-full-url', item.url],
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

clearBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all visit history? This cannot be undone.')) {
    chrome.storage.local.set({ visitHistory: [] }, () => {
      if (chrome.runtime.lastError) {
        alert('Could not clear visit history. Please try again.');
        return;
      }
      loadHistory();
    });
  }
});

loadHistory();
