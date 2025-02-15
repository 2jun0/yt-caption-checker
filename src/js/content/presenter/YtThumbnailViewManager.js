import {
  YT_THUMBNAIL_SELECTOR,
  YtThumbnailView,
  isThumbnailElement,
} from '../view/YtThumbnailView.js'

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
    return this.findAllThumbnailEls().map(
      thumbnailEl => new YtThumbnailView(thumbnailEl),
    )
  }

  /**
   * Find all thumbnail elements
   * @returns {HTMLElement[]}
   */
  findAllThumbnailEls() {
    return Array.from(
      this.document.querySelectorAll(YT_THUMBNAIL_SELECTOR),
    ).filter(isThumbnailElement)
  }
}
