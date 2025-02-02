import { MessageManager } from '../../utils/MessageManager.js'
import { Storage } from '../../store/Storage.js'
import { COLOR_TXT_FIELD } from '../../store/contants.js'

export class CcTagTextColorModel {
  /** @type {Storage} */
  _storage = null
  /** @type {MessageManager} */
  _messageManager = null

  /**
   * Initialize
   * @param {Storage} stoarge
   * @param {MessageManager} messageManager
   */
  init(stoarge, messageManager) {
    this._storage = stoarge
    this._messageManager = messageManager
  }

  async setTextColor(txtColor) {
    await this._storage.saveDataAsync(COLOR_TXT_FIELD, txtColor)
    this._messageManager.sendMessage(COLOR_TXT_FIELD, txtColor)
  }
}
