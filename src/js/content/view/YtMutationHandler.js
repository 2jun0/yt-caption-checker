import { CcTagPresenter } from '../presenter/CcTagPresenter.js'
import { YtThumbnailView } from './YtThumbnailView.js'

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

      if (isThumbnail(targetEl) && !isInPlayList(targetEl)) {
        const ytThumbnailView = YtThumbnailView(targetEl)
        ccTagPresenter.onThumbnailAdded(ytThumbnailView)
      }
    })
  }
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
