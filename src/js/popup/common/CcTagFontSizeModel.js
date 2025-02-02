import { MessageManager } from '../../utils/MessageManager.js'
import { Storage } from '../../store/Storage.js'
import { CC_PREVIEW_FONT_SIZE_FIELD } from '../../store/contants.js'

export class CcTagFontSizeModel {
  /** @type {Storage} */
  _storage = null
  /** @type {MessageManager} */
  _messageManager = null

  /**
   * Initialize
   * @param {Storage} storage
   * @param {MessageManager} messageManager
   */
  init(storage, messageManager) {
    this._storage = storage
    this._messageManager = messageManager
  }

  async setFontSize(fontSize) {
    await this._storage.saveDataAsync(CC_PREVIEW_FONT_SIZE_FIELD, fontSize)
    this._messageManager.sendMessage(CC_PREVIEW_FONT_SIZE_FIELD, fontSize)
  }
}
