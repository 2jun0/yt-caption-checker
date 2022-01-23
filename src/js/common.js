export function getYTVideoId(url) {
  return url.match(/\?v=([\w-]+)/)[1]
}

// Get current tab id
export function getTabId(callback) {
  const intervalId = setInterval(() => {
    chrome.tabs.query({ currentWindow: true }, tabs => {
      if (tabs) {
        callback(tabs[0].id)
        clearInterval(intervalId)
      }
    })
  }, 1)
}

export function requestAysnc(method, url, msg = null) {
  return new Promise(resolve => {
    let xhr = new XMLHttpRequest()
    xhr.onload = function () {
      if (this.readyState === this.DONE)
        if (this.status === 200) resolve(this.responseText)

      if (this.status === 404) resolve(null)
    }

    xhr.open(method, url)
    xhr.send(msg)
  })
}

export function localize() {
  document.querySelectorAll('[data-locale]').forEach(e => {
    e.innerText = chrome.i18n.getMessage(e.dataset.locale)
  })
}
