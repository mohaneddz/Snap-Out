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
  sitesList.innerHTML = '';
  
  if (blockedSites.length === 0) {
    sitesList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🌐</div>
        <div class="empty-state-text">No blocked websites yet. Add one above to get started!</div>
      </div>
    `;
    return;
  }
  
  blockedSites.forEach((site, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>🔒 ${site}</span>
      <button class="delete-btn" data-index="${index}">Remove</button>
    `;
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
