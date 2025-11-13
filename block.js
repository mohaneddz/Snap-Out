const urlParams = new URLSearchParams(window.location.search);
const blockedUrl = urlParams.get('url');

document.getElementById('blockedUrl').textContent = blockedUrl || '';

const reasonInput = document.getElementById('reasonInput');
const continueBtn = document.getElementById('continueBtn');
const goBackBtn = document.getElementById('goBackBtn');
const errorMessage = document.getElementById('errorMessage');
const charCount = document.getElementById('charCount');

continueBtn.addEventListener('click', () => {
  const reason = reasonInput.value.trim();
  
  if (!reason) {
    showError('Please enter a reason before continuing.');
    reasonInput.focus();
    return;
  }
  
  continueBtn.disabled = true;
  continueBtn.innerHTML = '<span style="opacity: 0.7;">⏳ Saving...</span>';
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.runtime.sendMessage({
      type: 'saveReason',
      url: blockedUrl,
      reason: reason,
      tabId: tabs[0].id
    }, (response) => {
      if (response && response.success) {
        window.location.href = blockedUrl;
      }
    });
  });
});

goBackBtn.addEventListener('click', () => {
  window.history.back();
});

// Character counter
reasonInput.addEventListener('input', () => {
  const length = reasonInput.value.trim().length;
  charCount.textContent = `${length} character${length !== 1 ? 's' : ''}`;
  continueBtn.disabled = length === 0;
  
  if (errorMessage.classList.contains('show')) {
    errorMessage.classList.remove('show');
  }
});

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
  setTimeout(() => {
    errorMessage.classList.remove('show');
  }, 3000);
}

continueBtn.disabled = true;
