export const CC_TAG_ID = 'cc-status'

/**
 * @typedef {Object} CcTagView
 * @property {(bgColor: any) => void} setBackgroundColor
 * @property {(txtColor: any) => void} setTextColor
 * @property {(fontSize: any) => void} setFontSize
 * @property {(lang: any) => void} setLanguage
 * @property {function} remove
 * @property {() => HTMLDivElement} ccTagElement
 */

/**
 * CC Tag View
 * @param {HTMLDivElement} ccTagDiv
 * @param {HTMLSpanElement} ccTagSpan
 */
export const CcTagView = (ccTagDiv, ccTagSpan) => {

  const setBackgroundColor = bgColor => {
    ccTagDiv.style.backgroundColor = bgColor
  }

  const setTextColor = txtColor => {
    ccTagDiv.style.color = txtColor
  }

  const setFontSize = fontSize => {
    ccTagDiv.style.fontSize = fontSize
  }

  const setLanguage = lang => {
    ccTagSpan.textContent = lang
  }

  const remove = () => {
    ccTagSpan.remove()
    ccTagDiv.remove()
  }

  const ccTagElement = () => {
    return ccTagDiv
  }

  return {
    setBackgroundColor,
    setTextColor,
    setFontSize,
    setLanguage,
    remove,
    ccTagElement
  }
}
