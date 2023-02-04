import { langs } from "../../utils/lang.js"
import { CcTagPreview } from "../common/CcTagPreview.js"
import { CombineRegionCheckBox } from "./CombineRegionCheckBox.js"
import { LanguageModel } from "./LanguageModel.js"
import { LanguagePicker } from "./LanguagePicker.js"

/**
 * @typedef {Object} LanguagePresenter
 * @property {(languagePicker: LanguagePicker, combineRegionCheckBox: CombineRegionCheckBox, ccTagPreview: CcTagPreview, model: LanguageModel) => void} init
 * @property {(lang: any) => Promise<void>} setLanguage
 * @property {(isCombinedRegion: any) => Promise<void>} setCombineRegion
 */

/**
 * CC Tag Language Picker Presenter
 * @returns {LanguagePresenter}
 */
export const LanguagePresenter = () => {
  /** @type {LanguagePicker} */
  let _languagePicker = null
  /** @type {CombineRegionCheckBox} */
  let _combineRegionCheckBox = null
  /** @type {CcTagPreview} */
  let _ccTagPreview = null
  /** @type {LanguageModel} */
  let _languageModel = null

  /**
   * initialize
   * @param {LanguagePicker} languagePicker 
   * @param {CombineRegionCheckBox} combineRegionCheckBox 
   * @param {CcTagPreview} ccTagPreview
   * @param {LanguageModel} model
   */
  const init = (languagePicker, combineRegionCheckBox, ccTagPreview, model) => {
    _languagePicker = languagePicker
    _combineRegionCheckBox = combineRegionCheckBox
    _ccTagPreview = ccTagPreview
    _languageModel = model
  }

  const setLanguage = async lang => {
    await _languageModel.setLanguage(lang)
    _languagePicker.setCurrentLanguage(lang)
    _ccTagPreview.setLanguage(lang)
  }

  const setCombineRegion = async isCombinedRegion => {
    await _languageModel.setCombineRegion(isCombinedRegion)
    _combineRegionCheckBox.setCombineRegion(isCombinedRegion)

    if (isCombinedRegion) {
      const lang = _languagePicker.getCurrentLanguageWithoutRegion()

      _languagePicker.setCurrentLanguage(lang)
      _ccTagPreview.setLanguage(lang)

      _languagePicker.updateLanuageList(langs.filter(
        lang => !lang.code.includes('-')))
    } else {
      _languagePicker.updateLanuageList(langs)
    }
  }

  return {
    init,
    setLanguage,
    setCombineRegion
  }
}