import { CcTagPreview } from "../common/CcTagPreview.js"
import { CcPreviewTextColorDisplay } from "./CcPreviewTextColorDisplay.js"
import { CcPreviewTextColorModel } from "./CcPreviewTextColorModel.js"
import { CcPreviewTextColorPicker } from "./CcPreviewTextColorPicker.js"

/**
 * @typedef {Object} CcPreviewTextColorPresenter
 * @property {(ccPreviewTextColorPicker: CcPreviewTextColorPicker, ccPreviewTextColorDisplay: CcPreviewTextColorDisplay, ccTagPreview: CcTagPreview, model: CcPreviewTextColorModel) => void} init
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
  /** @type {CcTagPreview} */
  let _ccTagPreview = null;
  /** @type {CcPreviewTextColorModel} */
  let _model = null;

  /**
   * initiaize
   * @param {CcPreviewTextColorPicker} ccPreviewTextColorPicker 
   * @param {CcPreviewTextColorDisplay} ccPreviewTextColorDisplay 
   * @param {CcTagPreview} ccTagPreview
   * @param {CcPreviewTextColorModel} model 
   */
  const init = (ccPreviewTextColorPicker, ccPreviewTextColorDisplay, ccTagPreview, model) => {
    _ccPreviewTextColorPicker = ccPreviewTextColorPicker
    _ccPreviewTextColorDisplay = ccPreviewTextColorDisplay
    _ccTagPreview = ccTagPreview
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
    _ccTagPreview.setTxtColor(txtColor)
  }

  return {
    init,
    toggleTextColorPicker,
    hideTextColorPicker,
    setTextColor
  }
}