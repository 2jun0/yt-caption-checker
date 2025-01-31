import { langs } from '../../utils/lang.js'
import { CcTagPreview } from '../common/CcTagPreview.js'
import { CcTagCombineRegionCheckBox } from './CcTagCombineRegionCheckBox.js'
import { CcTagLanguageModel } from './CcTagLanguageModel.js'
import { CcTagLanguagePicker } from './CcTagLanguagePicker.js'

export class CcTagLanguagePresenter {
  /** @type {CcTagLanguagePicker} */
  _ccTagLanguagePicker = null
  /** @type {CcTagCombineRegionCheckBox} */
  _ccTagCombineRegionCheckBox = null
  /** @type {CcTagPreview} */
  _ccTagPreview = null
  /** @type {CcTagLanguageModel} */
  _ccTagLanguageModel = null

  /**
   * Init
   * @param {CcTagLanguagePicker} ccTagLanguagePicker
   * @param {CcTagCombineRegionCheckBox} ccTagCombineRegionCheckBox
   * @param {CcTagPreview} ccTagPreview
   * @param {CcTagLanguageModel} model
   */
  init(ccTagLanguagePicker, ccTagCombineRegionCheckBox, ccTagPreview, model) {
    this._ccTagLanguagePicker = ccTagLanguagePicker
    this._ccTagCombineRegionCheckBox = ccTagCombineRegionCheckBox
    this._ccTagPreview = ccTagPreview
    this._ccTagLanguageModel = model
  }
  async setLanguage(lang) {
    await this._ccTagLanguageModel.setLanguage(lang)
    this._ccTagLanguagePicker.setCurrentLanguage(
      this._ccTagLanguageModel.shownLanguage(),
    )
    this._ccTagPreview.setLanguage(this._ccTagLanguageModel.shownLanguage())
  }

  async setCombineRegion(isCombinedRegion) {
    await this._ccTagLanguageModel.setCombineRegion(isCombinedRegion)
    this._ccTagCombineRegionCheckBox.setCombineRegion(isCombinedRegion)

    if (isCombinedRegion) {
      this._ccTagLanguagePicker.updateLanuageList(
        langs.filter(lang => !lang.code.includes('-')),
      )
    } else {
      this._ccTagLanguagePicker.updateLanuageList(langs)
    }

    this._ccTagLanguagePicker.setCurrentLanguage(
      this._ccTagLanguageModel.shownLanguage(),
    )
    this._ccTagPreview.setLanguage(this._ccTagLanguageModel.shownLanguage())
  }
}
