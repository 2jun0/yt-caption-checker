import { CcTagPreview } from '../common/CcTagPreview.js'
import { CcTagTextColorDisplay } from './CcTagTextColorDisplay.js'
import { CcTagTextColorModel } from './CcTagTextColorModel.js'
import { CcTagTextColorPicker } from './CcTagTextColorPicker.js'

export class CcTagTextColorPresenter {
  /** @type {CcTagTextColorPicker} */
  _ccTagTextColorPicker = null
  /** @type {CcTagTextColorDisplay} */
  _ccTagTextColorDisplay = null
  /** @type {CcTagPreview} */
  _ccTagPreview = null
  /** @type {CcTagTextColorModel} */
  _model = null

  /**
   * Initialize
   * @param {CcTagTextColorPicker} ccTagTextColorPicker
   * @param {CcTagTextColorDisplay} ccTagTextColorDisplay
   * @param {CcTagPreview} ccTagPreview
   * @param {CcTagTextColorModel} model
   */
  init(ccTagTextColorPicker, ccTagTextColorDisplay, ccTagPreview, model) {
    this._ccTagTextColorPicker = ccTagTextColorPicker
    this._ccTagTextColorDisplay = ccTagTextColorDisplay
    this._ccTagPreview = ccTagPreview
    this._model = model
  }

  toggleTextColorPicker() {
    if (this._ccTagTextColorPicker.isDisplay()) {
      this._ccTagTextColorPicker.hide()
    } else {
      this._ccTagTextColorPicker.display()
    }
  }

  hideTextColorPicker() {
    this._ccTagTextColorPicker.hide()
  }

  async setTextColor(txtColor) {
    await this._model.setTextColor(txtColor)

    this._ccTagTextColorPicker.setColor(txtColor)
    this._ccTagTextColorDisplay.setColor(txtColor)
    this._ccTagPreview.setTxtColor(txtColor)
  }
}
