import { CcStatusExample } from "../common/CcStatusExample.js";
import { CcPreviewBackgroundColorDisplay } from "./CcPreviewBackgroundColorDisplay.js";
import { CcPreviewBackgroundColorModel } from "./CcPreviewBackgroundColorModel.js";
import { CcPreviewBackgroundColorPicker } from "./CcPreviewBackgroundColorPicker.js";

/**
 * @typedef {Object} CcPreviewBackgroundColorPresenter
 * @property {(backgroundColorPicker: CcPreviewBackgroundColorPicker, backgroundColorDisplay: CcPreviewBackgroundColorDisplay, ccStatusExample: CcStatusExample, model: CcPreviewBackgroundColorModel) => void} init
 * @property {function} toggleBackgroundColorPicker
 * @property {function} hideBackgroundColorPicker
 * @property {(bgColor: any) => Promise<void>} setBackgroundColor
 */

/**
 * CC Preview Background Color Picker Presenter
 * @returns {CcPreviewBackgroundColorPresenter}
 */
export const CcPreviewBackgroundColorPresenter = () => {
  /** @type {CcPreviewBackgroundColorPicker} */
  let _backgroundColorPicker = null;
  /** @type {CcPreviewBackgroundColorDisplay} */
  let _backgroundColorDisplay = null;
  /** @type {CcStatusExample} */
  let _ccStatusExample = null;
  /** @type {CcPreviewBackgroundColorModel} */
  let _model = null;

  /**
   * initialize
   * @param {CcPreviewBackgroundColorPicker} backgroundColorPicker 
   * @param {CcPreviewBackgroundColorDisplay} backgroundColorDisplay 
   * @param {CcStatusExample} ccStatusExample
   * @param {CcPreviewBackgroundColorModel} model 
   */
  const init = (backgroundColorPicker, backgroundColorDisplay, ccStatusExample, model) => {
    _backgroundColorPicker = backgroundColorPicker
    _backgroundColorDisplay = backgroundColorDisplay
    _ccStatusExample = ccStatusExample
    _model = model
  }

  const toggleBackgroundColorPicker = () => {
    if (_backgroundColorPicker.isDisplay()) {
      _backgroundColorPicker.hide()
    } else {
      _backgroundColorPicker.display()
    }
  }

  const hideBackgroundColorPicker = () => {
    _backgroundColorPicker.hide()
  }

  const setBackgroundColor = async bgColor => {
    await _model.setBackgroundColor(bgColor)

    _backgroundColorPicker.setColor(bgColor)
    _backgroundColorDisplay.setColor(bgColor)
    _ccStatusExample.setBackgroundColor(bgColor)
  }

  return {
    init,
    toggleBackgroundColorPicker,
    hideBackgroundColorPicker,
    setBackgroundColor
  }
}