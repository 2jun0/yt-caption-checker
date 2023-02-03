import { MessageManager } from "../../utils/MessageManager"
import { CC_PREVIEW_FONT_SIZE_FIELD, Storage } from "../../utils/storage"

/**
 * @typedef {Object} CcPreviewFontSizeModel
 * @property {(stoarge: Storage, messageManager: MessageManager) => void} init
 * @property {(fontSize: any) => Promise<void>} setFontSize
 */

/**
 * CC Preview Size Picker Model
 * @returns {CcPreviewFontSizeModel}
 */
export const CcPreviewFontSizeModel = () => {
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