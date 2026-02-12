import { InvalidYouTubeVideoUrlError } from './errors.js'

export const EXTENSION_NAME = 'yt-caption-checker'

export const getYTVideoId = url => {
  const matched = url.match(/\?v=([\w-]+)/)
  if (!matched) {
    throw new InvalidYouTubeVideoUrlError(
      `can't find video id of url: '${url}'`,
    )
  }

  return matched[1]
}

export const localize = () => {
  document.querySelectorAll('[data-locale]').forEach(e => {
    e.innerText = chrome.i18n.getMessage(e.dataset.locale)
  })
}

export const debug = (...args) => {
  const IS_DEV = '__YCC_DEV__' === 'true'
  if (!IS_DEV) return
  console.debug('[yt-caption-checker]', ...args)
}
