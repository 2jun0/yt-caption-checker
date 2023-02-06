import { CcPreviewFontSizeModel } from "./CcPreviewFontSizeModel.js"
import { CcPreviewFontSizePicker } from "./CcPreviewFontSizePicker.js"
import { CcStatusExample } from "./CcStatusExample.js"

/**
 * @typedef {Object} CcPreviewFontSizePresenter
 * @property {(ccPreviewFontSizePicker: CcPreviewFontSizePicker, ccStatusExample: CcStatusExample, ccPreviewFontSizeModel: CcPreviewFontSizeModel) => void} init
 * @property {(fontSize: any) => Promise<void>} setFontSize
 */

/**
 * CC Preview Size Picker Presenter
 * @returns {CcPreviewFontSizePresenter}
 */
export const CcPreviewFontSizePresenter = () => {
  /** @type {CcPreviewFontSizePicker} */
  let _ccPreviewFontSizePicker = null
  /** @type {CcStatusExample} */
  let _ccStatusExample = null
  /** @type {CcPreviewFontSizeModel} */
  let _ccPreviewFontSizeModel = null

  /**
   * init function
   * @param {CcPreviewFontSizePicker} ccPreviewFontSizePicker 
   * @param {CcStatusExample} ccStatusExample
   * @param {CcPreviewFontSizeModel} ccPreviewFontSizeModel
   */
  const init = (ccPreviewFontSizePicker, ccStatusExample, ccPreviewFontSizeModel) => {
    _ccPreviewFontSizePicker = ccPreviewFontSizePicker
    _ccStatusExample = ccStatusExample
    _ccPreviewFontSizeModel = ccPreviewFontSizeModel
  }

  const setFontSize = async fontSize => {
    await _ccPreviewFontSizeModel.setFontSize(fontSize)
    _ccPreviewFontSizePicker.setFontSize(fontSize)
    _ccStatusExample.setFontSize(fontSize)
  }

  return {
    init,
    setFontSize
  }
}