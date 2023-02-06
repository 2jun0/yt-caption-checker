import { MessageManager } from "../../utils/MessageManager.js"
import { CC_PREVIEW_FONT_SIZE_FIELD, Storage } from "../../utils/storage.js"

/**
 * @typedef {Object} CcTagFontSizeModel
 * @property {(stoarge: Storage, messageManager: MessageManager) => void} init
 * @property {(fontSize: any) => Promise<void>} setFontSize
 */

/**
 * CC Tag Size Picker Model
 * @returns {CcTagFontSizeModel}
 */
export const CcTagFontSizeModel = () => {
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

  const setFontSize = async fontSize => {
    await _storage.saveDataAsync(CC_PREVIEW_FONT_SIZE_FIELD, fontSize)
    _messageManager.sendMessage(CC_PREVIEW_FONT_SIZE_FIELD, fontSize)
  }

  return {
    init,
    setFontSize
  }
}