import { CcStatusExample } from "../common/CcStatusExample.js"
import { CcPreviewTextColorDisplay } from "./CcPreviewTextColorDisplay.js"
import { CcPreviewTextColorModel } from "./CcPreviewTextColorModel.js"
import { CcPreviewTextColorPicker } from "./CcPreviewTextColorPicker.js"

/**
 * @typedef {Object} CcPreviewTextColorPresenter
 * @property {(ccPreviewTextColorPicker: CcPreviewTextColorPicker, ccPreviewTextColorDisplay: CcPreviewTextColorDisplay, ccStatusExample: CcStatusExample, model: CcPreviewTextColorModel) => void} init
 * @property {function} toggleTextColorPicker
 * @property {function} hideTextColorPicker
 * @property {(txtColor: any) => Promise<void>} setTextColor
 */

/**
 * CC Preview Text Color Picker Presenter
 * @returns {CcPreviewTextColorPresenter}
 */
export const CcPreviewTextColorPresenter = () => {
  /** @type {CcPreviewTextColorPicker} */
  let _ccPreviewTextColorPicker = null;
  /** @type {CcPreviewTextColorDisplay} */
  let _ccPreviewTextColorDisplay = null;
  /** @type {CcStatusExample} */
  let _ccStatusExample = null;
  /** @type {CcPreviewTextColorModel} */
  let _model = null;

  /**
   * initiaize
   * @param {CcPreviewTextColorPicker} ccPreviewTextColorPicker 
   * @param {CcPreviewTextColorDisplay} ccPreviewTextColorDisplay 
   * @param {CcStatusExample} ccStatusExample
   * @param {CcPreviewTextColorModel} model 
   */
  const init = (ccPreviewTextColorPicker, ccPreviewTextColorDisplay, ccStatusExample, model) => {
    _ccPreviewTextColorPicker = ccPreviewTextColorPicker
    _ccPreviewTextColorDisplay = ccPreviewTextColorDisplay
    _ccStatusExample = ccStatusExample
    _model = model
  }

  const toggleTextColorPicker = () => {
    if (_ccPreviewTextColorPicker.isDisplay()) {
      _ccPreviewTextColorPicker.hide()
    } else {
      _ccPreviewTextColorPicker.display()
    }
  }

  const hideTextColorPicker = () => {
    _ccPreviewTextColorPicker.hide()
  }

  const setTextColor = async txtColor => {
    await _model.setTextColor(txtColor)

    _ccPreviewTextColorPicker.setColor(txtColor)
    _ccPreviewTextColorDisplay.setColor(txtColor)
    _ccStatusExample.setTxtColor(txtColor)
  }

  return {
    init,
    toggleTextColorPicker,
    hideTextColorPicker,
    setTextColor
  }
}