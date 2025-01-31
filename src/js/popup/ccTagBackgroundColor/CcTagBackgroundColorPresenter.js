import { CcTagPreview } from '../common/CcTagPreview.js'
import { CcTagBackgroundColorDisplay } from './CcTagBackgroundColorDisplay.js'
import { CcTagBackgroundColorModel } from './CcTagBackgroundColorModel.js'
import { CcTagBackgroundColorPicker } from './CcTagBackgroundColorPicker.js'

export class CcTagBackgroundColorPresenter {
  /** @type {CcTagBackgroundColorPicker} */
  _backgroundColorPicker = null
  /** @type {CcTagBackgroundColorDisplay} */
  _backgroundColorDisplay = null
  /** @type {CcTagPreview} */
  _ccTagPreview = null
  /** @type {CcTagBackgroundColorModel} */
  _model = null

  /**
   * init function
   * @param {CcTagBackgroundColorPicker} backgroundColorPicker
   * @param {CcTagBackgroundColorDisplay} backgroundColorDisplay
   * @param {CcTagPreview} ccTagPreview
   * @param {CcTagBackgroundColorModel} model
   */
  init(backgroundColorPicker, backgroundColorDisplay, ccTagPreview, model) {
    this._backgroundColorPicker = backgroundColorPicker
    this._backgroundColorDisplay = backgroundColorDisplay
    this._ccTagPreview = ccTagPreview
    this._model = model
  }

  toggleBackgroundColorPicker() {
    if (this._backgroundColorPicker.isDisplay()) {
      this._backgroundColorPicker.hide()
    } else {
      this._backgroundColorPicker.display()
    }
  }

  hideBackgroundColorPicker() {
    this._backgroundColorPicker.hide()
  }

  async setBackgroundColor(bgColor) {
    await this._model.setBackgroundColor(bgColor)

    this._backgroundColorPicker.setColor(bgColor)
    this._backgroundColorDisplay.setColor(bgColor)
    this._ccTagPreview.setBackgroundColor(bgColor)
  }
}
