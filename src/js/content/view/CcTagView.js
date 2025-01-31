export const CC_TAG_ID = 'cc-status'

export class CcTagView {
  /**
   * @param {HTMLDivElement} ccTagDiv
   * @param {HTMLSpanElement} ccTagSpan
   */
  constructor(ccTagDiv, ccTagSpan) {
    this.ccTagDiv = ccTagDiv
    this.ccTagSpan = ccTagSpan
  }

  setBackgroundColor(bgColor) {
    this.ccTagDiv.style.backgroundColor = bgColor
  }

  setTextColor(txtColor) {
    this.ccTagDiv.style.color = txtColor
  }

  setFontSize(fontSize) {
    this.ccTagDiv.style.fontSize = fontSize
  }

  setLanguage(lang) {
    this.ccTagSpan.textContent = lang
  }

  remove() {
    this.ccTagSpan.remove()
    this.ccTagDiv.remove()
  }

  /**
   * Get the ccTag element
   * @returns {HTMLDivElement}
   */
  ccTagElement() {
    return this.ccTagDiv
  }
}
