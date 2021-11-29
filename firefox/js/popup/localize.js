document.querySelectorAll('[data-locale]').forEach((e) => {
  e.innerText = chrome.i18n.getMessage(e.dataset.locale);
});
