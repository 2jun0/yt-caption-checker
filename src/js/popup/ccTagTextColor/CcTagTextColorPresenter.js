import { CcTagPreview } from "../common/CcTagPreview.js"
import { CcTagTextColorDisplay } from "./CcTagTextColorDisplay.js"
import { CcTagTextColorModel } from "./CcTagTextColorModel.js"
import { CcTagTextColorPicker } from "./CcTagTextColorPicker.js"

/**
 * @typedef {Object} CcTagTextColorPresenter
 * @property {(ccTagTextColorPicker: CcTagTextColorPicker, ccTagTextColorDisplay: CcTagTextColorDisplay, ccTagPreview: CcTagPreview, model: CcTagTextColorModel) => void} init
 * @property {function} toggleTextColorPicker
 * @property {function} hideTextColorPicker
 * @property {(txtColor: any) => Promise<void>} setTextColor
 */

/**
 * CC Tag Text Color Picker Presenter
 * @returns {CcTagTextColorPresenter}
 */
export const CcTagTextColorPresenter = () => {
  /** @type {CcTagTextColorPicker} */
  let _ccTagTextColorPicker = null;
  /** @type {CcTagTextColorDisplay} */
  let _ccTagTextColorDisplay = null;
  /** @type {CcTagPreview} */
  let _ccTagPreview = null;
  /** @type {CcTagTextColorModel} */
  let _model = null;

  /**
   * initiaize
   * @param {CcTagTextColorPicker} ccTagTextColorPicker 
   * @param {CcTagTextColorDisplay} ccTagTextColorDisplay 
   * @param {CcTagPreview} ccTagPreview
   * @param {CcTagTextColorModel} model 
   */
  const init = (ccTagTextColorPicker, ccTagTextColorDisplay, ccTagPreview, model) => {
    _ccTagTextColorPicker = ccTagTextColorPicker
    _ccTagTextColorDisplay = ccTagTextColorDisplay
    _ccTagPreview = ccTagPreview
    _model = model
  }

  const toggleTextColorPicker = () => {
    if (_ccTagTextColorPicker.isDisplay()) {
      _ccTagTextColorPicker.hide()
    } else {
      _ccTagTextColorPicker.display()
    }
  }

  const hideTextColorPicker = () => {
    _ccTagTextColorPicker.hide()
  }

  const setTextColor = async txtColor => {
    await _model.setTextColor(txtColor)

    _ccTagTextColorPicker.setColor(txtColor)
    _ccTagTextColorDisplay.setColor(txtColor)
    _ccTagPreview.setTxtColor(txtColor)
  }

  return {
    init,
    toggleTextColorPicker,
    hideTextColorPicker,
    setTextColor
  }
}