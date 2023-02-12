import { YtThumbnailView, isThumbnailElement } from '../view/YtThumbnailView.js'

/**
 * @typedef {Object} YtThumbnailViewManager
 * @property {() => YtThumbnailView[]} findAllThumbnailView
 */

/**
 * YouTube Thumbnail View Manager
 * @param {Document} document
 * @returns {YtThumbnailViewManager}
 */
export const YtThumbnailViewManager = document => {
  /**
   * find all thumbnail view
   * it need to be initialized
   * @returns {YtThumbnailView[]}
   */
  const findAllThumbnailView = () => {
    return findAllThumbnail().map(thumbnailEl => YtThumbnailView(thumbnailEl))
  }

  /**
   * find all thumbnail elements
   * @returns {HTMLElement[]}
   */
  const findAllThumbnail = () => {
    return Array.from(document.querySelectorAll('a#thumbnail')).filter(
      isThumbnailElement,
    )
  }

  return {
    findAllThumbnailView,
  }
}
