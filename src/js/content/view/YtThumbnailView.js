import { InvalidYouTubeThumnailElementError } from '../../utils/errors.js'
import { CC_TAG_ID, CcTagView } from './CcTagView.js'

/**
 * Check If Element is ThumbnailElement
 * @param {HTMLElement} el
 */
export const isThumbnailElement = el => {
  const isOldThumbnail =
    el.tagName == 'A' &&
    el.id == 'thumbnail' &&
    el.href &&
    el.href.match(/\?v=([\w-]+)/);

  const isNewThumbnail =
    el.tagName == 'A' &&
    el.classList &&
    el.classList.contains('yt-lockup-view-model__content-image') &&
    el.href &&
    el.href.match(/\?v=([\w-]+)/);

  return isOldThumbnail || isNewThumbnail
}

export class YtThumbnailView {
  /**
   * @param {HTMLElement} thumbnailEl
   */
  constructor(thumbnailEl) {
    this.thumbnailEl = thumbnailEl
    this._overlays = null

    this._validateThumbnailElementTagName()
    this._validateThumbnailElementIdOrClass()
    this._validateThumbnailElementHref()
  }

  /**
   * Insert CC tag in YouTube thumbnail
   * @param {CcTagView} ccTagView
   * @returns {Promise<void>}
   */
  async insertCcTag(ccTagView) {
    const overlays = this._getOverlays()
    if (!overlays || (await this.hasCcTag())) return

    overlays.insertBefore(ccTagView.ccTagElement(), overlays.lastChild)
  }

  /**
   * Check if CC tag exists
   * @returns {Promise<boolean>}
   */
  async hasCcTag() {
    const overlays = await this._getOverlays()
    if (!overlays) return false

    return !!overlays.querySelector(`#${CC_TAG_ID}`)
  }

  /**
   * Get video URL
   * @returns {string}
   */
  getVideoUrl() {
    return this.thumbnailEl.href
  }

  /**
   * Get overlays
   * @returns {HTMLElement}
   */
  _getOverlays() {
    if (!this._overlays) {
      this._overlays = this.thumbnailEl.querySelector('#overlays') ?? this.thumbnailEl
    }
    return this._overlays
  }

  _validateThumbnailElementTagName() {
    if (this.thumbnailEl.tagName !== 'A') {
      throw new InvalidYouTubeThumnailElementError(
        `tag name of thumbnail element is not 'A' (it is ${this.thumbnailEl.tagName})`,
      )
    }
  }

  _validateThumbnailElementIdOrClass() {
    const isOldThumbnail = this.thumbnailEl.id === 'thumbnail'
    const isNewThumbnail =
      this.thumbnailEl.classList?.contains?.('yt-lockup-view-model__content-image') ===
      true

    if (!isOldThumbnail && !isNewThumbnail) {
      throw new InvalidYouTubeThumnailElementError(
        `thumbnail element is neither old nor new thumbnail type (id : ${this.thumbnailEl.id}, class : ${this.thumbnailEl.className})`,
      )
    }
  }

  _validateThumbnailElementHref() {
    if (!this.thumbnailEl.href) {
      throw new InvalidYouTubeThumnailElementError(
        `thumbnail element hasn't href property`,
      )
    }
  }
}
