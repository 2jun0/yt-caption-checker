import { CcStatusExample } from "../common/CcStatusExample.js"
import { ColorTxtDisplay } from "./ColorTxtDisplay.js"
import { ColorTxtModel } from "./ColorTxtModel.js"
import { ColorTxtPicker } from "./ColorTxtPicker.js"

/**
 * @typedef {Object} ColorTxtPresenter
 * @property {(colorTxtPicker: ColorTxtPicker, colorTxtDisplay: ColorTxtDisplay, ccStatusExample: CcStatusExample, model: ColorTxtModel) => void} init
 * @property {function} toggleTextColorPicker
 * @property {function} hideTextColorPicker
 * @property {(txtColor: any) => Promise<void>} setTextColor
 */

/**
 * CC Preview Text Color Picker Presenter
 * @returns {ColorTxtPresenter}
 */
export const ColorTxtPresenter = () => {
  /** @type {ColorTxtPicker} */
  let _colorTxtPicker = null;
  /** @type {ColorTxtDisplay} */
  let _colorTxtDisplay = null;
  /** @type {CcStatusExample} */
  let _ccStatusExample = null;
  /** @type {ColorTxtModel} */
  let _model = null;

  /**
   * initiaize
   * @param {ColorTxtPicker} colorTxtPicker 
   * @param {ColorTxtDisplay} colorTxtDisplay 
   * @param {CcStatusExample} ccStatusExample
   * @param {ColorTxtModel} model 
   */
  const init = (colorTxtPicker, colorTxtDisplay, ccStatusExample, model) => {
    _colorTxtPicker = colorTxtPicker
    _colorTxtDisplay = colorTxtDisplay
    _ccStatusExample = ccStatusExample
    _model = model
  }

  const toggleTextColorPicker = () => {
    if (_colorTxtPicker.isDisplay()) {
      _colorTxtPicker.hide()
    } else {
      _colorTxtPicker.display()
    }
  }

  const hideTextColorPicker = () => {
    _colorTxtPicker.hide()
  }

  const setTextColor = async txtColor => {
    await _model.setTextColor(txtColor)

    _colorTxtPicker.setColor(txtColor)
    _colorTxtDisplay.setColor(txtColor)
    _ccStatusExample.setTxtColor(txtColor)
  }

  return {
    init,
    toggleTextColorPicker,
    hideTextColorPicker,
    setTextColor
  }
}