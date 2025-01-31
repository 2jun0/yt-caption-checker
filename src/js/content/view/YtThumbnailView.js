import { InvalidYouTubeThumnailElementError } from '../../utils/errors.js'
import { CC_TAG_ID, CcTagView } from './CcTagView.js'

/**
 * Check If Element is ThumbnailElement
 * @param {HTMLElement} el
 */
export const isThumbnailElement = el => {
  return (
    el.tagName == 'A' &&
    el.id == 'thumbnail' &&
    el.href &&
    el.href.match(/\?v=([\w-]+)/)
  )
}

export class YtThumbnailView {
  /**
   * @param {HTMLElement} thumbnailEl
   */
  constructor(thumbnailEl) {
    this.thumbnailEl = thumbnailEl
    this._overlays = null

    this._validateThumbnailElementTagName()
    this._validateThumbnailElementId()
    this._validateThumbnailElementHref()
  }

  /**
   * Insert CC tag in YouTube thumbnail
   * @param {CcTagView} ccTagView
   * @returns {Promise<void>}
   */
  async insertCcTag(ccTagView) {
    const overlays = await this._getOverlays()
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
   * @returns {Promise<HTMLElement>}
   */
  async _getOverlays() {
    if (!this._overlays) {
      this._overlays = await this._waitOverlayLoadedAsync()
    }
    return this._overlays
  }

  /**
   * Wait for overlay to load
   * @returns {Promise<HTMLElement>}
   */
  async _waitOverlayLoadedAsync() {
    const overlays = this.thumbnailEl.querySelector('#overlays')

    if (overlays.childElementCount > 0) {
      return overlays
    }

    let timer = null

    return new Promise(resolve => {
      const observer = new MutationObserver(() => {
        if (overlays.childElementCount > 0) {
          observer.disconnect()
          clearTimeout(timer)
          resolve(overlays)
        }
      })
      observer.observe(this.thumbnailEl, {
        childList: true,
        subtree: true,
      })

      timer = setTimeout(() => {
        observer.disconnect()
        resolve(null)
      }, 5000)
    })
  }

  _validateThumbnailElementTagName() {
    if (this.thumbnailEl.tagName !== 'A') {
      throw new InvalidYouTubeThumnailElementError(
        `tag name of thumbnail element is not 'A' (it is ${this.thumbnailEl.tagName})`,
      )
    }
  }

  _validateThumbnailElementId() {
    if (this.thumbnailEl.id !== 'thumbnail') {
      throw new InvalidYouTubeThumnailElementError(
        `id of thumbnail element is not 'thumbnail' (it is ${this.thumbnailEl.id})`,
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
