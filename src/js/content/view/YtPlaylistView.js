import { InvalidYouTubePlaylistElementError } from '../../utils/errors.js'

export const YT_PLAYLIST_SELECTOR = 'YT-COLLECTIONS-STACK'

export class YtPlaylistView {
  /**
   * @param {HTMLElement} playlistlEl
   */
  constructor(playlistEl) {
    this._playlistEl = playlistEl
    this._container = null
  }

  async setVisible(visible) {
    const container = await this._getVideoContainer()
    if (!container) return

    if (visible) {
      container.style.display = null
    } else {
      container.style.display = 'none'
    }
  }

  /**
   * Get a video container that the playlist element belongs to
   * @returns {Promise<HTMLElement>}
   */
  async _getVideoContainer() {
    if (!this._container) {
      this._container = this._playlistEl.parentElement
      while (
        this._container &&
        this._container.tagName != 'YT-LOCKUP-VIEW-MODEL' &&
        this._container.tagName != 'YTD-VIDEO-RENDERER' &&
        this._container.tagName != 'YTD-RICH-ITEM-RENDERER' &&
        this._container.tagName != 'YTD-COMPACT-VIDEO-RENDERER'
      ) {
        this._container = this._container.parentElement
      }
    }

    return this._container
  }

  _validatePlaylistElement() {
    if (this._playlistEl.tagName != YT_PLAYLIST_SELECTOR) {
      throw new InvalidYouTubePlaylistElementError(
        `tag name of playlist element is not ${YT_PLAYLIST_SELECTOR} (it is ${this._playlistEl.tagName})`,
      )
    }
  }
}
