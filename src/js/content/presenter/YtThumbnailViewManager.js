import { YtThumbnailView, isThumbnailElement } from '../view/YtThumbnailView.js'

export class YtThumbnailViewManager {
  /**
   * @param {Document} document
   */
  constructor(document) {
    this.document = document
  }

  /**
   * Find all thumbnail view
   * @returns {YtThumbnailView[]}
   */
  findAllThumbnailView() {
    return this.findAllThumbnail().map(
      thumbnailEl => new YtThumbnailView(thumbnailEl),
    )
  }

  /**
   * Find all thumbnail elements
   * @returns {HTMLElement[]}
   */
  findAllThumbnail() {
    return Array.from(this.document.querySelectorAll('a#thumbnail')).filter(
      isThumbnailElement,
    )
  }
}
