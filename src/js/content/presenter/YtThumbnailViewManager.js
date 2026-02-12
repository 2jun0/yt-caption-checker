import { YtThumbnailView, isThumbnailElement } from '../view/YtThumbnailView.js'
import { debug } from '../../utils/common.js'

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
    const selector = 'a#thumbnail, a.yt-lockup-view-model__content-image'
    const thumbnails = Array.from(this.document.querySelectorAll(selector))
      .filter(isThumbnailElement)

    debug('YtThumbnailViewManager: findAllThumbnail', {
      thumbnails,
    })

    return thumbnails
  }
}
