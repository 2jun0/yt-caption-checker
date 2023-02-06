import { CcTagView, CC_TAG_ID } from "../view/CcTagView.js"

/**
 * @typedef {Object} CcTagFactory
 * @property {(backgroundColor: any, textColor: any, fontSize: any, lang: any) => CcTagView} createCcTagView
 */

/**
 * CC Tag Factory
 * @param {Document} document
 * @returns {CcTagFactory}
 */
export const CcTagFactory = document => {

  /**
   * create cc tag view
   * @param {*} backgroundColor 
   * @param {*} textColor 
   * @param {*} fontSize 
   * @param {*} lang 
   * @returns {CcTagView}
   */
  const createCcTagView = (backgroundColor, textColor, fontSize, language) => {
    const ccTagDiv = createCcTagDiv(document, backgroundColor, textColor, fontSize)
    const ccTagSpan = createCcTagSpan(document, language)
    ccTagDiv.appendChild(ccTagSpan)

    return CcTagView(ccTagDiv, ccTagSpan)
  }

  return {
    createCcTagView
  }
}

/**
 * Create CC Tag Div Element
 * @param {Document} document 
 * @param {*} backgroundColor 
 * @param {*} textColor 
 * @param {*} fontSize 
 * @returns {HTMLDivElement}
 */
const createCcTagDiv = (document, backgroundColor, textColor, fontSize) => {
  const ccTagDiv = document.createElement('div')
  Object.assign(ccTagDiv, {
    id: CC_TAG_ID,
    overlayStyle: 'DEFAULT',
    className: 'style-scope ytd-thumbnail'
  })

  Object.assign(ccTagDiv.style, {
    backgroundColor,
    color: textColor,
    fontSize
  })

  return ccTagDiv
}

/**
 * Create CC Tag Span Element
 * @param {Document} document 
 * @param {string} language 
 * @returns {HTMLSpanElement}
 */
const createCcTagSpan = (document, language) => {
  const ccTagSpan = document.createElement('span')
  Object.assign(ccTagSpan, {
    className: 'style-scope ytd-thumbnail-overlay-time-status-renderer',
    ariaLabel: language.toUpperCase() + ' CC',
    textContent: language.toUpperCase() + ' CC'
  })

  return ccTagSpan
}