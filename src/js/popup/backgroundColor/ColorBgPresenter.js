import { CcStatusExample } from "../common/CcStatusExample";
import { ColorBgDisplay } from "./ColorBgDisplay";
import { ColorBgModel } from "./ColorBgModel";
import { ColorBgPicker } from "./ColorBgPicker";

/**
 * @typedef {Object} ColorBgPresenter
 * @property {(colorBgPicker: ColorBgPicker, colorBgDisplay: ColorBgDisplay, ccStatusExample: CcStatusExample, model: ColorBgModel) => void} init
 * @property {function} toggleBackgroundColorPicker
 * @property {function} hideBackgroundColorPicker
 * @property {(bgColor: any) => Promise<void>} setBackgroundColor
 */

/**
 * CC Preview Background Color Picker Presenter
 * @returns {ColorBgPresenter}
 */
export const ColorBgPresenter = () => {
  /** @type {ColorBgPicker} */
  let _colorBgPicker = null;
  /** @type {ColorBgDisplay} */
  let _colorBgDisplay = null;
  /** @type {CcStatusExample} */
  let _ccStatusExample = null;
  /** @type {ColorBgModel} */
  let _model = null;

  /**
   * initialize
   * @param {ColorBgPicker} colorBgPicker 
   * @param {ColorBgDisplay} colorBgDisplay 
   * @param {CcStatusExample} ccStatusExample
   * @param {ColorBgModel} model 
   */
  const init = (colorBgPicker, colorBgDisplay, ccStatusExample, model) => {
    _colorBgPicker = colorBgPicker
    _colorBgDisplay = colorBgDisplay
    _ccStatusExample = ccStatusExample
    _model = model
  }

  const toggleBackgroundColorPicker = () => {
    if (_colorBgPicker.isDisplay()) {
      _colorBgPicker.hide()
    } else {
      _colorBgPicker.display()
    }
  }

  const hideBackgroundColorPicker = () => {
    _colorBgDisplay.hide()
  }

  const setBackgroundColor = async bgColor => {
    await _model.setBackgroundColor(bgColor)

    _colorBgPicker.setColor(bgColor)
    _colorBgDisplay.setColor(bgColor)
    _ccStatusExample.setBackgroundColor(bgColor)
  }

  return {
    init,
    toggleBackgroundColorPicker,
    hideBackgroundColorPicker,
    setBackgroundColor
  }
}