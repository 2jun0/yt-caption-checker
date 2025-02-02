import { MessageManager } from '../../utils/MessageManager.js'
import { Storage } from '../../store/Storage.js'
import { COLOR_BG_FIELD } from '../../store/contants.js'

export class CcTagBackgroundColorModel {
  constructor() {
    /** @type {Storage} */
    this._storage = null
    /** @type {MessageManager} */
    this._messageManager = null
  }

  /**
   * init function
   * @param {Storage} stoarge
   * @param {MessageManager} messageManager
   */
  init(stoarge, messageManager) {
    this._storage = stoarge
    this._messageManager = messageManager
  }

  async setBackgroundColor(bgColor) {
    await this._storage.saveDataAsync(COLOR_BG_FIELD, bgColor)
    this._messageManager.sendMessage(COLOR_BG_FIELD, bgColor)
  }
}
