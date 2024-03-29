import { MessageManager } from '../../utils/MessageManager.js'
import { COLOR_TXT_FIELD, Storage } from '../../utils/storage.js'

/**
 * @typedef {Object} CcTagTextColorModel
 * @property {(stoarge: Storage, messageManager: MessageManager) => void} init
 * @property {(txtColor: any) => Promise<void>} setTextColor
 */

/**
 * CC Tag Text Color Model
 * @returns {CcTagTextColorModel}
 */
export const CcTagTextColorModel = () => {
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
    setTextColor,
  }
}
