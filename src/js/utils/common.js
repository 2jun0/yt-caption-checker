export const getYTVideoId = url => {
  return url.match(/\?v=([\w-]+)/)[1]
}

export const localize = () => {
  document.querySelectorAll('[data-locale]').forEach(e => {
    e.innerText = chrome.i18n.getMessage(e.dataset.locale)
  })
}
