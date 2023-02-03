import { langs } from "../../utils/lang";
import { CcStatusExample } from "../common/CcStatusExample";
import { CombineRegionCheckBox } from "./CombineRegionCheckBox";
import { LanguageModel } from "./LanguageModel";
import { LanguagePicker } from "./LanguagePicker";

/**
 * @typedef {Object} LanguagePresenter
 * @property {(languagePicker: LanguagePicker, combineRegionCheckBox: CombineRegionCheckBox, ccStatusExample: CcStatusExample, model: LanguageModel) => void} init
 * @property {(lang: any) => Promise<void>} setLanguage
 * @property {(isCombinedRegion: any) => Promise<void>} setCombineRegion
 */

/**
 * CC Preview Language Picker Presenter
 * @returns {LanguagePresenter}
 */
export const LanguagePresenter = () => {
  /** @type {LanguagePicker} */
  let _languagePicker = null
  /** @type {CombineRegionCheckBox} */
  let _combineRegionCheckBox = null
  /** @type {CcStatusExample} */
  let _ccStatusExample = null
  /** @type {LanguageModel} */
  let _languageModel = null

  /**
   * initialize
   * @param {LanguagePicker} languagePicker 
   * @param {CombineRegionCheckBox} combineRegionCheckBox 
   * @param {CcStatusExample} ccStatusExample
   * @param {LanguageModel} model
   */
  const init = (languagePicker, combineRegionCheckBox, ccStatusExample, model) => {
    _languagePicker = languagePicker
    _combineRegionCheckBox = combineRegionCheckBox
    _ccStatusExample = ccStatusExample
    _languageModel = model
  }

  const setLanguage = async lang => {
    await _languageModel.setLanguage(lang)
    _languagePicker.setCurrentLanguage(lang)
  }

  const setCombineRegion = async isCombinedRegion => {
    await _languageModel.setCombineRegion(isCombinedRegion)
    _combineRegionCheckBox.setCombineRegion(isCombinedRegion)

    if (isCombinedRegion) {
      const lang = _languagePicker.getCurrentLanguageWithoutRegion()

      _languagePicker.setCombineRegion(lang)
      _ccStatusExample.setLanguage(lang)

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