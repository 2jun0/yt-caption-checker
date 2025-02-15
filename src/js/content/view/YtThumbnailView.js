import { InvalidYouTubeThumnailElementError } from '../../utils/errors.js'
import { CC_TAG_ID, CcTagView } from './CcTagView.js'

export const YT_THUMBNAIL_SELECTOR = 'YTD-THUMBNAIL'

/**
 * Check If Element is ThumbnailElement
 * @param {HTMLElement} el
 */
export const isThumbnailElement = el => {
  const aTag = el.querySelector('A#thumbnail')
  return aTag && aTag.href && aTag.href.match(/\?v=([\w-]+)/)
}

export class YtThumbnailView {
  /**
   * @param {HTMLElement} thumbnailEl
   */
  constructor(thumbnailEl) {
    this.thumbnailEl = thumbnailEl

    this._validateYtThumbnailElementTagName()
    this._videoUrl = this._validateVideoUrl()
    this._overlays = null
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
   * @returns {string}
   */
  get videoUrl() {
    return this._videoUrl
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

  /**
   * @returns {string}
   */
  _validateVideoUrl() {
    const aTag = this.thumbnailEl.querySelector('A#thumbnail')
    if (!aTag || !aTag.href || !aTag.href.match(/\?v=([\w-]+)/)) {
      throw new InvalidYouTubeThumnailElementError(
        `the thumbnail hasn't video url`,
      )
    }

    return aTag.href
  }

  _validateYtThumbnailElementTagName() {
    if (this.thumbnailEl.tagName != YT_THUMBNAIL_SELECTOR) {
      throw new InvalidYouTubeThumnailElementError(
        `the thumbnail's tag name isn't ${YT_THUMBNAIL_SELECTOR}`,
      )
    }
  }
}
