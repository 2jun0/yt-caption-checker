import { CcTagPresenter } from "../presenter/CcTagPresenter.js"
import { YtThumbnailView } from "./YtThumbnailView.js"

/**
 * @typedef {Object} YtObserver
 * @property {function} init
 */

/**
 * YouTube Observer
 * It need to be initialized
 * @param {Document} document
 * @param {CcTagPresenter} ccTagPresenter
 * @returns {YtObserver}
 */
export const YtObserver = (document, ccTagPresenter) => {
  /** @type {MutationObserver} */
  let observer = null

  /**
   * init
   */
  const init = async () => {
    // TODO: await waitForDOM(document)
    observer = getObserver()
  }

  /**
   * get observer
   * @returns {MutationObserver}
   */
  const getObserver = () => {
    const observer = new MutationObserver(handleMutations)
    observer.observe(document.body, {
      subtree: true,
      attributeFilter: ['href']
    })

    return observer
  }

  const handleMutations = mutations => {
    mutations.forEach(async mutation => {
      const targetEl = mutation.target

      if (isThumbnail(targetEl) && !isInPlayList(targetEl)) {
        const ytThumbnailView = YtThumbnailView(targetEl)
        ccTagPresenter.onThumbnailAdded(ytThumbnailView)
      }
    })
  }

  return {
    init
  }
}

/**
 * wait for dom
 * @param {Document} document 
 * @returns 
 */
const waitForDOM = async document => {
  if (document.body) {
    return
  }

  document.addEventListener('DOMContentLoaded', () => {
    return new Promise((resolve) => {
      resolve()
    })
  })
}

/**
 * is htmlelement thumbnail
 * @param {HTMLElement} el 
 * @returns {boolean}
 */
const isThumbnail = el => el.tagName == 'A' && el.id == 'thumbnail'

/**
 * is in playlist
 * @param {HTMLElement} el 
 * @returns {boolean}
 */
const isInPlayList = el => el.parentElement.tagName == 'YTD-PLAYLIST-THUMBNAIL'