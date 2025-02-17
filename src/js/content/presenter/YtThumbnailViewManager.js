import {
  YT_THUMBNAIL_SELECTOR,
  YtThumbnailView,
  isThumbnailElement,
} from '../view/YtThumbnailView.js'
import { YT_PLAYLIST_SELECTOR, YtPlaylistView } from '../view/YtPlaylistView.js'

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

  /**
   * Find all playlist views
   * @returns {YtPlaylistView[]}
   */
  findAllPlaylistViews() {
    return Array.from(this.document.querySelectorAll(YT_PLAYLIST_SELECTOR)).map(
      ytPlaylistEl => new YtPlaylistView(ytPlaylistEl),
    )
  }
}
