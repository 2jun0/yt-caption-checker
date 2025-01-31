import { CcTagFontSizeModel } from './CcTagFontSizeModel.js'
import { CcTagFontSizePicker } from './CcTagFontSizePicker.js'
import { CcTagPreview } from './CcTagPreview.js'

export class CcTagFontSizePresenter {
  /** @type {CcTagFontSizePicker} */
  _ccTagFontSizePicker = null
  /** @type {CcTagPreview} */
  _ccTagPreview = null
  /** @type {CcTagFontSizeModel} */
  _ccTagFontSizeModel = null

  /**
   * Initialize
   * @param {CcTagFontSizePicker} ccTagFontSizePicker
   * @param {CcTagPreview} ccTagPreview
   * @param {CcTagFontSizeModel} ccTagFontSizeModel
   */
  init(ccTagFontSizePicker, ccTagPreview, ccTagFontSizeModel) {
    this._ccTagFontSizePicker = ccTagFontSizePicker
    this._ccTagPreview = ccTagPreview
    this._ccTagFontSizeModel = ccTagFontSizeModel
  }

  async setFontSize(fontSize) {
    await this._ccTagFontSizeModel.setFontSize(fontSize)
    this._ccTagFontSizePicker.setFontSize(fontSize)
    this._ccTagPreview.setFontSize(fontSize)
  }
}
