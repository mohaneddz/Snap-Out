const reasonInput = document.getElementById('reasonInput');
const continueBtn = document.getElementById('continueBtn');
const goBackBtn = document.getElementById('goBackBtn');
const errorMessage = document.getElementById('errorMessage');
const charCount = document.getElementById('charCount');
const targetLabel = document.getElementById('blockedUrl');

let target;
try {
  const candidate = new URL(location.hash.slice(1));
  if (candidate.protocol === 'http:' || candidate.protocol === 'https:') target = candidate;
} catch { /* An invalid redirect stays on the prompt page. */ }

targetLabel.textContent = target ? target.hostname : 'Unknown website';
if (!target) showError('The destination is missing. Please go back and try again.');

reasonInput.addEventListener('input', () => {
  const length = reasonInput.value.trim().length;
  charCount.textContent = `${length} character${length === 1 ? '' : 's'}`;
  continueBtn.disabled = !target || length === 0;
  errorMessage.classList.remove('show');
});

continueBtn.addEventListener('click', () => {
  const reason = reasonInput.value.trim();
  if (!target || !reason) {
    showError('Please enter a reason before continuing.');
    reasonInput.focus();
    return;
  }

  continueBtn.disabled = true;
  continueBtn.textContent = 'Saving…';
  chrome.runtime.sendMessage({ type: 'continueToSite', reason }, response => {
    const error = chrome.runtime.lastError?.message || response?.error;
    if (error || !response?.success) {
      showError(error || 'Could not save this visit. Please try again.');
      continueBtn.textContent = 'Continue to Website';
      continueBtn.disabled = false;
      return;
    }
    location.assign(response.url);
  });
});

goBackBtn.addEventListener('click', () => {
  if (history.length > 1) history.back();
  else location.replace('about:blank');
});

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
}

continueBtn.disabled = true;
