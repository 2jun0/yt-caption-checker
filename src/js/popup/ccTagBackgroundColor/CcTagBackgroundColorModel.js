import { MessageManager } from "../../utils/MessageManager.js";
import { COLOR_BG_FIELD, Storage } from "../../utils/storage.js";

/**
 * @typedef {Object} CcTagBackgroundColorModel
 * @property {(stoarge: Storage, messageManager: MessageManager) => void} init
 * @property {(bgColor: any) => Promise<void>} setBackgroundColor
 */

/**
 * CC Tag Background Color Model
 * @returns {CcTagBackgroundColorModel}
 */
export const CcTagBackgroundColorModel = () => {
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
  
  const setBackgroundColor = async bgColor => {
    await _storage.saveDataAsync(COLOR_BG_FIELD, bgColor)
    _messageManager.sendMessage(COLOR_BG_FIELD, bgColor)
  }

  return {
    init,
    setBackgroundColor
  }
}