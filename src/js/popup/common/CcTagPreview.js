const CC_TAG_PREVIEW_ID = 'cc-status-example'

export class CcTagPreview {
  /** @type {HTMLElement} */
  _ccTagPreview = null

  /**
   * Constructor
   * @param {Document} document
   */
  constructor(document) {
    this._ccTagPreview = document.getElementById(CC_TAG_PREVIEW_ID)
  }

  setLanguage(lang) {
    this._ccTagPreview.textContent = lang.toUpperCase() + ' CC'
  }

  setTxtColor(txtColor) {
    this._ccTagPreview.style.color = txtColor
  }

  setBackgroundColor(bgColor) {
    this._ccTagPreview.style.background = bgColor
  }

  setFontSize(fontSize) {
    this._ccTagPreview.style.fontSize = `calc(${fontSize} - 0.4rem)`
  }
}
