import { MessageManager } from "../../utils/MessageManager";
import { COLOR_BG_FIELD, Storage } from "../../utils/storage";

/**
 * @typedef {Object} ColorBgModel
 * @property {function} init
 * @property {(bgColor: any) => Promise<void>} setBackgroundColor
 */

/**
 * CC Preview Background Color Model
 * @returns {ColorBgModel}
 */
export const ColorBgModel = () => {
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