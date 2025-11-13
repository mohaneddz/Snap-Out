const newSiteInput = document.getElementById('newSite');
const addBtn = document.getElementById('addBtn');
const sitesList = document.getElementById('sitesList');
const status = document.getElementById('status');
const sitesCount = document.getElementById('sitesCount');

let blockedSites = [];

// Load blocked sites
function loadSites() {
  chrome.storage.sync.get(['blockedSites'], (result) => {
    blockedSites = result.blockedSites || [];
    renderSites();
  });
}

// Render sites list
function renderSites() {
  sitesCount.textContent = blockedSites.length;
  sitesList.textContent = '';
  
  if (blockedSites.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'empty-state';
    
    const icon = document.createElement('div');
    icon.className = 'empty-state-icon';
    icon.textContent = '🌐';
    emptyDiv.appendChild(icon);
    
    const text = document.createElement('div');
    text.className = 'empty-state-text';
    text.textContent = 'No blocked websites yet. Add one above to get started!';
    emptyDiv.appendChild(text);
    
    sitesList.appendChild(emptyDiv);
    return;
  }
  
  blockedSites.forEach((site, index) => {
    const li = document.createElement('li');
    
    const span = document.createElement('span');
    span.textContent = `🔒 ${site}`;
    li.appendChild(span);
    
    const btn = document.createElement('button');
    btn.className = 'delete-btn';
    btn.setAttribute('data-index', index);
    btn.textContent = 'Remove';
    li.appendChild(btn);
    
    sitesList.appendChild(li);
  });
}

// Add new site
addBtn.addEventListener('click', () => {
  const site = newSiteInput.value.trim().toLowerCase();
  
  if (!site) {
    showStatus('Please enter a website', false);
    return;
  }
  
  if (blockedSites.includes(site)) {
    showStatus('Website already in the list', false);
    return;
  }
  
  blockedSites.push(site);
  saveSites();
  newSiteInput.value = '';
  showStatus('✓ Website added successfully', true);
});

// Handle Enter key
newSiteInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});

// Remove site
sitesList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const index = parseInt(e.target.dataset.index);
    blockedSites.splice(index, 1);
    saveSites();
    showStatus('Website removed', true);
  }
});

// Save sites
function saveSites() {
  chrome.storage.sync.set({ blockedSites: blockedSites }, () => {
    renderSites();
  });
}

// Show status message
function showStatus(message, isSuccess) {
  status.textContent = message;
  status.className = 'status show ' + (isSuccess ? 'success' : 'error');
  setTimeout(() => {
    status.classList.remove('show');
  }, 3000);
}

loadSites();
