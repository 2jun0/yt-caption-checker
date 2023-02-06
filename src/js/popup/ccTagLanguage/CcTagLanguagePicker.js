import { CcTagLanguagePresenter } from "./CcTagLanguagePresenter.js";

const LANG_PICKER_ID = 'lang-picker'

/**
 * @typedef {Object} CcTagLanguagePicker
 * @property {(ccTagLanguagePresenter: CcTagLanguagePresenter) => void} init
 * @property {function} updateLanuageList
 * @property {function} getCurrentLanguage
 * @property {function} setCurrentLanguage
 */

/**
 * CC Tag Language Picker Element
 * @param {Document} document 
 * @returns {CcTagLanguagePicker}
 */
export const CcTagLanguagePicker = document => {
  const languagePicker = document.getElementById(LANG_PICKER_ID);

  /**
   * initialize
   * @param {CcTagLanguagePresenter} ccTagLanguagePresenter 
   * @param {*} langs
   */
  const init = (ccTagLanguagePresenter, langs) => {
    languagePicker.onchange = () => {
      ccTagLanguagePresenter.setLanguage(languagePicker.value)
    }

    updateLanuageList(langs)
  }
  
  const updateLanuageList = langs => {
    let current = getCurrentLanguage()

    while (languagePicker.firstChild) {
      languagePicker.removeChild(languagePicker.firstChild)
    }

    langs.forEach(lang => {
      languagePicker.appendChild(createOption(lang))
    })

    setCurrentLanguage(current)
  }

  const createOption = lang => {
    let option = document.createElement('option')
    option.value = lang.code
    option.textContent = lang.displayName
    return option
  }

  const getCurrentLanguage = () => {
    return languagePicker.value
  }
  
  const setCurrentLanguage = lang => {
    languagePicker.value = lang
  }

  return {
    init,
    updateLanuageList,
    getCurrentLanguage,
    setCurrentLanguage
  }
}
