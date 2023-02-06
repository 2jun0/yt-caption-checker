import { MessageManager } from "../../utils/MessageManager.js"
import { IS_COMBINED_REGION_FIELD, LANGUAGE_FIELD, Storage } from "../../utils/storage.js"

/**
 * @typedef {Object} LanguageModel
 * @property {(stoarge: Storage, messageManager: MessageManager) => void} init
 * @property {(lang: any) => Promise<void>} setLanguage
 * @property {(isCombinedRegion: any) => Promise<void>} setCombineRegion 
 */

/**
 * CC Preview Language Model
 * @returns {LanguageModel}
 */
export const LanguageModel = () => {
  /** @type {Storage} */
  let _storage = null
  /** @type {MessageManager} */
  let _messageManager = null

  /**
   * init function
   * @param {Storage} stoarge 
   * @param {MessageManager} messageManager 
   */
  const init = (stoarge, messageManager) => {
    _storage = stoarge
    _messageManager = messageManager
  }
  
  const setLanguage = async lang => {
    await _storage.saveDataAsync(LANGUAGE_FIELD, lang)
    _messageManager.sendMessage(LANGUAGE_FIELD, lang)
  }

  const setCombineRegion = async isCombinedRegion => {
    await _storage.saveDataAsync(IS_COMBINED_REGION_FIELD, isCombinedRegion)
    _messageManager.sendMessage(IS_COMBINED_REGION_FIELD, isCombinedRegion)
  }

  return {
    init,
    setLanguage,
    setCombineRegion
  }
}