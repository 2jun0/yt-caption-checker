import { CcTagPresenter } from './CcTagPresenter.js'
import { YtThumbnailView, isThumbnailElement } from '../view/YtThumbnailView.js'

/**
 * @typedef {Object} YtMutationHandler
 */

/**
 * YouTube Mutation Handler
 * @example
 *  const observer = new MutationObserver(YtMutationHandler(ccTagPresenter))
 *  observer.observe(document.body, {
 *    subtree: true,
 *    attributeFilter: ['href'],
 *  })
 * @param {CcTagPresenter} ccTagPresenter
 * @returns {YtMutationHandler}
 */
export const YtMutationHandler = ccTagPresenter => {
  return mutations => {
    mutations.forEach(async mutation => {
      const targetEl = mutation.target

      if (isThumbnailElement(targetEl) && !isInPlayList(targetEl)) {
        const ytThumbnailView = YtThumbnailView(targetEl)
        ccTagPresenter.onThumbnailAdded(ytThumbnailView)
      }
    })
  }
}

/**
 * is in playlist
 * @param {HTMLElement} el
 * @returns {boolean}
 */
const isInPlayList = el => el.parentElement.tagName == 'YTD-PLAYLIST-THUMBNAIL'
