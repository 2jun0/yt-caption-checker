import { langs } from "../../utils/lang.js"
import { CcTagPreview } from "../common/CcTagPreview.js"
import { CcTagCombineRegionCheckBox } from "./CcTagCombineRegionCheckBox.js"
import { CcTagLanguageModel } from "./CcTagLanguageModel.js"
import { CcTagLanguagePicker } from "./CcTagLanguagePicker.js"

/**
 * @typedef {Object} CcTagLanguagePresenter
 * @property {(ccTagLanguagePicker: CcTagLanguagePicker, ccTagCombineRegionCheckBox: CcTagCombineRegionCheckBox, ccTagPreview: CcTagPreview, model: CcTagLanguageModel) => void} init
 * @property {(lang: any) => Promise<void>} setLanguage
 * @property {(isCombinedRegion: any) => Promise<void>} setCombineRegion
 */

/**
 * CC Tag Language Picker Presenter
 * @returns {CcTagLanguagePresenter}
 */
export const CcTagLanguagePresenter = () => {
  /** @type {CcTagLanguagePicker} */
  let _ccTagLanguagePicker = null
  /** @type {CcTagCombineRegionCheckBox} */
  let _ccTagCombineRegionCheckBox = null
  /** @type {CcTagPreview} */
  let _ccTagPreview = null
  /** @type {CcTagLanguageModel} */
  let _ccTagLanguageModel = null

  /**
   * initialize
   * @param {CcTagLanguagePicker} ccTagLanguagePicker 
   * @param {CcTagCombineRegionCheckBox} ccTagCombineRegionCheckBox 
   * @param {CcTagPreview} ccTagPreview
   * @param {CcTagLanguageModel} model
   */
  const init = (ccTagLanguagePicker, ccTagCombineRegionCheckBox, ccTagPreview, model) => {
    _ccTagLanguagePicker = ccTagLanguagePicker
    _ccTagCombineRegionCheckBox = ccTagCombineRegionCheckBox
    _ccTagPreview = ccTagPreview
    _ccTagLanguageModel = model
  }

  const setLanguage = async lang => {
    await _ccTagLanguageModel.setLanguage(lang)
    _ccTagLanguagePicker.setCurrentLanguage(_ccTagLanguageModel.shownLanguage())
    _ccTagPreview.setLanguage(_ccTagLanguageModel.shownLanguage())
  }

  const setCombineRegion = async isCombinedRegion => {
    await _ccTagLanguageModel.setCombineRegion(isCombinedRegion)
    _ccTagCombineRegionCheckBox.setCombineRegion(isCombinedRegion)

    if (isCombinedRegion) {
      _ccTagLanguagePicker.updateLanuageList(langs.filter(
        lang => !lang.code.includes('-')))
    } else {
      _ccTagLanguagePicker.updateLanuageList(langs)
    }

    _ccTagLanguagePicker.setCurrentLanguage(_ccTagLanguageModel.shownLanguage())
    _ccTagPreview.setLanguage(_ccTagLanguageModel.shownLanguage())
  }

  return {
    init,
    setLanguage,
    setCombineRegion
  }
}