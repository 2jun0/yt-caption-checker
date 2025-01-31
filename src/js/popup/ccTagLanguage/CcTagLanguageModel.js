import { MessageManager } from '../../utils/MessageManager.js'
import {
  IS_COMBINED_REGION_FIELD,
  LANGUAGE_FIELD,
  Storage,
} from '../../utils/Storage.js'

export class CcTagLanguageModel {
  /** @type {Storage} */
  _storage = null
  /** @type {MessageManager} */
  _messageManager = null
  _language = null
  _isCombinedRegion = null

  /**
   * Init
   * @param {Storage} storage
   * @param {MessageManager} messageManager
   */
  init(storage, messageManager) {
    this._storage = storage
    this._messageManager = messageManager
  }

  async setLanguage(lang) {
    await this._storage.saveDataAsync(LANGUAGE_FIELD, lang)
    this._language = lang
    this._messageManager.sendMessage(LANGUAGE_FIELD, lang)
  }

  async setCombineRegion(isCombinedRegion) {
    await this._storage.saveDataAsync(
      IS_COMBINED_REGION_FIELD,
      isCombinedRegion,
    )
    this._isCombinedRegion = isCombinedRegion
    this._messageManager.sendMessage(IS_COMBINED_REGION_FIELD, isCombinedRegion)
  }

  shownLanguage() {
    if (this._isCombinedRegion) {
      return this._language.split('-')[0]
    } else {
      return this._language
    }
  }
}
