import { CcTagPreview } from '../common/CcTagPreview.js'
import { CcTagBackgroundColorDisplay } from './CcTagBackgroundColorDisplay.js'
import { CcTagBackgroundColorModel } from './CcTagBackgroundColorModel.js'
import { CcTagBackgroundColorPicker } from './CcTagBackgroundColorPicker.js'

/**
 * @typedef {Object} CcTagBackgroundColorPresenter
 * @property {(backgroundColorPicker: CcTagBackgroundColorPicker, backgroundColorDisplay: CcTagBackgroundColorDisplay, ccTagPreview: CcTagPreview, model: CcTagBackgroundColorModel) => void} init
 * @property {function} toggleBackgroundColorPicker
 * @property {function} hideBackgroundColorPicker
 * @property {(bgColor: any) => Promise<void>} setBackgroundColor
 */

/**
 * CC Tag Background Color Picker Presenter
 * @returns {CcTagBackgroundColorPresenter}
 */
export const CcTagBackgroundColorPresenter = () => {
  /** @type {CcTagBackgroundColorPicker} */
  let _backgroundColorPicker = null
  /** @type {CcTagBackgroundColorDisplay} */
  let _backgroundColorDisplay = null
  /** @type {CcTagPreview} */
  let _ccTagPreview = null
  /** @type {CcTagBackgroundColorModel} */
  let _model = null

  /**
   * initialize
   * @param {CcTagBackgroundColorPicker} backgroundColorPicker
   * @param {CcTagBackgroundColorDisplay} backgroundColorDisplay
   * @param {CcTagPreview} ccTagPreview
   * @param {CcTagBackgroundColorModel} model
   */
  const init = (
    backgroundColorPicker,
    backgroundColorDisplay,
    ccTagPreview,
    model,
  ) => {
    _backgroundColorPicker = backgroundColorPicker
    _backgroundColorDisplay = backgroundColorDisplay
    _ccTagPreview = ccTagPreview
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
    _ccTagPreview.setBackgroundColor(bgColor)
  }

  return {
    init,
    toggleBackgroundColorPicker,
    hideBackgroundColorPicker,
    setBackgroundColor,
  }
}
