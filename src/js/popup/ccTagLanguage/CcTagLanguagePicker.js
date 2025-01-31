export class CcTagLanguagePicker {
  /** @type {HTMLElement} */
  languagePicker = null

  /**
   * Constructor
   * @param {Document} document
   */
  constructor(document) {
    this.languagePicker = document.getElementById('lang-picker')
  }

  /**
   * init function
   * @param {CcTagLanguagePresenter} ccTagLanguagePresenter
   * @param {*} langs
   */
  init(ccTagLanguagePresenter, langs) {
    this.languagePicker.onchange = () => {
      ccTagLanguagePresenter.setLanguage(this.languagePicker.value)
    }

    this.updateLanguageList(langs)
  }

  updateLanguageList(langs) {
    const current = this.getCurrentLanguage()

    while (this.languagePicker.firstChild) {
      this.languagePicker.removeChild(this.languagePicker.firstChild)
    }

    langs.forEach(lang => {
      this.languagePicker.appendChild(this.createOption(lang))
    })

    this.setCurrentLanguage(current)
  }

  createOption(lang) {
    const option = document.createElement('option')
    option.value = lang.code
    option.textContent = lang.displayName
    return option
  }

  getCurrentLanguage() {
    return this.languagePicker.value
  }

  setCurrentLanguage(lang) {
    this.languagePicker.value = lang
  }
}
