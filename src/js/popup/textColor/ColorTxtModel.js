import { MessageManager } from "../../utils/MessageManager"
import { COLOR_TXT_FIELD, Storage } from "../../utils/storage"

/**
 * @typedef {Object} ColorTxtModel
 * @property {(stoarge: Storage, messageManager: MessageManager) => void} init
 * @property {(txtColor: any) => Promise<void>} setTextColor
 */

/**
 * CC Preview Text Color Model
 * @returns {ColorTxtModel}
 */
export const ColorTxtModel = () => {
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
  
  const setTextColor = async txtColor => {
    await _storage.saveDataAsync(COLOR_TXT_FIELD, txtColor)
    _messageManager.sendMessage(COLOR_TXT_FIELD, txtColor)
  }

  return {
    init,
    setTextColor
  }
}