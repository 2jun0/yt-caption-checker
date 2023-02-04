import { CcPreviewFontSizeModel } from "./CcPreviewFontSizeModel.js"
import { CcPreviewFontSizePicker } from "./CcPreviewFontSizePicker.js"
import { CcTagPreview } from "./CcTagPreview.js"

/**
 * @typedef {Object} CcPreviewFontSizePresenter
 * @property {(ccPreviewFontSizePicker: CcPreviewFontSizePicker, ccTagPreview: CcTagPreview, ccPreviewFontSizeModel: CcPreviewFontSizeModel) => void} init
 * @property {(fontSize: any) => Promise<void>} setFontSize
 */

/**
 * CC Preview Size Picker Presenter
 * @returns {CcPreviewFontSizePresenter}
 */
export const CcPreviewFontSizePresenter = () => {
  /** @type {CcPreviewFontSizePicker} */
  let _ccPreviewFontSizePicker = null
  /** @type {CcTagPreview} */
  let _ccTagPreview = null
  /** @type {CcPreviewFontSizeModel} */
  let _ccPreviewFontSizeModel = null

  /**
   * init function
   * @param {CcPreviewFontSizePicker} ccPreviewFontSizePicker 
   * @param {CcTagPreview} ccTagPreview
   * @param {CcPreviewFontSizeModel} ccPreviewFontSizeModel
   */
  const init = (ccPreviewFontSizePicker, ccTagPreview, ccPreviewFontSizeModel) => {
    _ccPreviewFontSizePicker = ccPreviewFontSizePicker
    _ccTagPreview = ccTagPreview
    _ccPreviewFontSizeModel = ccPreviewFontSizeModel
  }

  const setFontSize = async fontSize => {
    await _ccPreviewFontSizeModel.setFontSize(fontSize)
    _ccPreviewFontSizePicker.setFontSize(fontSize)
    _ccTagPreview.setFontSize(fontSize)
  }

  return {
    init,
    setFontSize
  }
}