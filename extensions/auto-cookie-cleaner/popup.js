const form = document.getElementById('settings-form');
const statusText = document.getElementById('status');
const excludeBox = document.getElementById('exclude');
const saveExcludeBtn = document.getElementById('save-exclude');

chrome.storage.local.get(['mode', 'excludeList', 'deletedCount'], ({ mode, excludeList, deletedCount }) => {
  form.querySelector(`input[value="${mode || 'closed'}"]`).checked = true;
  excludeBox.value = (excludeList || []).join('\n');
  document.getElementById('counter').textContent = deletedCount || 0;
});

form.addEventListener('change', () => {
  const mode = form.mode.value;
  chrome.storage.local.set({ mode }, () => {
    statusText.textContent = '✅ Настройки сохранены';
    statusText.classList.add('active');
    setTimeout(() => {
      statusText.classList.remove('active');
      statusText.textContent = '';
    }, 1500);
  });
});

saveExcludeBtn.addEventListener('click', () => {
  const domains = excludeBox.value
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);
  chrome.storage.local.set({ excludeList: domains }, () => {
    statusText.textContent = '✅ Исключения сохранены';
    statusText.classList.add('active');
    setTimeout(() => {
      statusText.classList.remove('active');
      statusText.textContent = '';
    }, 1500);
  });
});
