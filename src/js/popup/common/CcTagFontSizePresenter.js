import { CcTagFontSizeModel } from './CcTagFontSizeModel.js'
import { CcTagFontSizePicker } from './CcTagFontSizePicker.js'
import { CcTagPreview } from './CcTagPreview.js'

/**
 * @typedef {Object} CcTagFontSizePresenter
 * @property {(ccTagFontSizePicker: CcTagFontSizePicker, ccTagPreview: CcTagPreview, ccTagFontSizeModel: CcTagFontSizeModel) => void} init
 * @property {(fontSize: any) => Promise<void>} setFontSize
 */

/**
 * CC Tag Size Picker Presenter
 * @returns {CcTagFontSizePresenter}
 */
export const CcTagFontSizePresenter = () => {
  /** @type {CcTagFontSizePicker} */
  let _ccTagFontSizePicker = null
  /** @type {CcTagPreview} */
  let _ccTagPreview = null
  /** @type {CcTagFontSizeModel} */
  let _ccTagFontSizeModel = null

  /**
   * init function
   * @param {CcTagFontSizePicker} ccTagFontSizePicker
   * @param {CcTagPreview} ccTagPreview
   * @param {CcTagFontSizeModel} ccTagFontSizeModel
   */
  const init = (ccTagFontSizePicker, ccTagPreview, ccTagFontSizeModel) => {
    _ccTagFontSizePicker = ccTagFontSizePicker
    _ccTagPreview = ccTagPreview
    _ccTagFontSizeModel = ccTagFontSizeModel
  }

  const setFontSize = async fontSize => {
    await _ccTagFontSizeModel.setFontSize(fontSize)
    _ccTagFontSizePicker.setFontSize(fontSize)
    _ccTagPreview.setFontSize(fontSize)
  }

  return {
    init,
    setFontSize,
  }
}
