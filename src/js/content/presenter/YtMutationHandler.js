import { CcTagPresenter } from './CcTagPresenter.js'
import {
  YT_THUMBNAIL_SELECTOR,
  YtThumbnailView,
  isThumbnailElement,
} from '../view/YtThumbnailView.js'

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
    mutations.forEach(mutation => {
      const targetEl = mutation.target

      targetEl
        .querySelectorAll(YT_THUMBNAIL_SELECTOR)
        .forEach(ytThumbnailEl => {
          if (isThumbnailElement(ytThumbnailEl)) {
            const ytThumbnailView = new YtThumbnailView(ytThumbnailEl)
            this.ccTagPresenter.onThumbnailAdded(ytThumbnailView)
          }
        })
    })
  }
}
