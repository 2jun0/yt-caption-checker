import { LanguagePresenter } from "./LanguagePresenter.js";

const LANG_PICKER_ID = 'lang-picker'

/**
 * @typedef {Object} LanguagePicker
 * @property {(languagePresenter: LanguagePresenter) => void} init
 * @property {function} updateLanuageList
 * @property {function} getCurrentLanguage
 * @property {function} getCurrentLanguageWithoutRegion
 * @property {function} setCurrentLanguage
 */

/**
 * Language Picker Element
 * @param {Document} document 
 * @returns {LanguagePicker}
 */
export const LanguagePicker = document => {
  const languagePicker = document.getElementById(LANG_PICKER_ID);

  /**
   * initialize
   * @param {LanguagePresenter} languagePresenter 
   */
  const init = languagePresenter => {
    languagePicker.onchange = () => {
      languagePresenter.setLanguage(languagePicker.value)
    }
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

  /**
   * get current language code without region code
   * @returns {string} language code
   */
  const getCurrentLanguageWithoutRegion = () => {
    return languagePicker.value.split('-')[0]
  }
  
  const setCurrentLanguage = lang => {
    languagePicker.value = lang
  }

  return {
    init,
    updateLanuageList,
    getCurrentLanguage,
    getCurrentLanguageWithoutRegion,
    setCurrentLanguage
  }
}
