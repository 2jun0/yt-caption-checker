import { CcTagPresenter } from './CcTagPresenter.js'
import { YtThumbnailView, isThumbnailElement } from '../view/YtThumbnailView.js'

/**
 * YouTube Mutation Handler
 * @example
 *  const observer = new MutationObserver(new YtMutationHandler(ccTagPresenter))
 *  observer.observe(document.body, {
 *    subtree: true,
 *    attributeFilter: ['href'],
 *  })
 */
export class YtMutationHandler {
  /**
   * @param {CcTagPresenter} ccTagPresenter
   */
  constructor(ccTagPresenter) {
    this.ccTagPresenter = ccTagPresenter
  }

  /**
   * Handle YouTube mutations
   * @param {MutationRecord[]} mutations
   */
  handleMutations(mutations) {
    mutations.forEach(async mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType !== Node.ELEMENT_NODE) return

        const targetEl = node.querySelector('a')
        if (!targetEl) return

        if (isThumbnailElement(targetEl) && !this._isInPlayList(targetEl)) {
          const ytThumbnailView = new YtThumbnailView(targetEl)
          this.ccTagPresenter.onThumbnailAdded(ytThumbnailView)
        }
      })
    })
  }

  /**
   * Check if element is in playlist
   * @param {HTMLElement} el
   * @returns {boolean}
   */
  _isInPlayList(el) {
    return el.parentElement.tagName == 'YTD-PLAYLIST-THUMBNAIL'
  }
}
