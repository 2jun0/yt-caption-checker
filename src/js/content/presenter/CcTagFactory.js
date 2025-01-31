import { CcTagView, CC_TAG_ID } from '../view/CcTagView.js'

export class CcTagFactory {
  /**
   * @param {Document} document
   */
  constructor(document) {
    this.document = document
  }

  /**
   * Create CC Tag View
   * @param {string} backgroundColor
   * @param {string} textColor
   * @param {string} fontSize
   * @param {string} language
   * @returns {CcTagView}
   */
  createCcTagView(backgroundColor, textColor, fontSize, language) {
    const ccTagDiv = this.createCcTagDiv(backgroundColor, textColor, fontSize)
    const ccTagSpan = this.createCcTagSpan(language)
    ccTagDiv.appendChild(ccTagSpan)

    return CcTagView(ccTagDiv, ccTagSpan)
  }

  /**
   * Create CC Tag Div Element
   * @param {string} backgroundColor
   * @param {string} textColor
   * @param {string} fontSize
   * @returns {HTMLDivElement}
   */
  createCcTagDiv(backgroundColor, textColor, fontSize) {
    const ccTagDiv = this.document.createElement('div')
    Object.assign(ccTagDiv, {
      id: CC_TAG_ID,
      overlayStyle: 'DEFAULT',
      className: 'style-scope ytd-thumbnail',
    })

    Object.assign(ccTagDiv.style, {
      backgroundColor,
      color: textColor,
      fontSize,
    })

    return ccTagDiv
  }

  /**
   * Create CC Tag Span Element
   * @param {string} language
   * @returns {HTMLSpanElement}
   */
  createCcTagSpan(language) {
    const ccTagSpan = this.document.createElement('span')
    Object.assign(ccTagSpan, {
      className: 'style-scope ytd-thumbnail-overlay-time-status-renderer',
      ariaLabel: `${language.toUpperCase()} CC`,
      textContent: `${language.toUpperCase()} CC`,
    })

    return ccTagSpan
  }
}
