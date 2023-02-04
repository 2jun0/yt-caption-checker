const CC_TAG_PREVIEW_ID = 'cc-status-example'

/**
 * @typedef {Object} CcTagPreview
 * @property {function} setLanguage
 * @property {function} setTxtColor
 * @property {function} setBackgroundColor
 * @property {function} setFontSize
 */

/**
 * CC Tag Previce Element
 * @param {Document} document 
 * @returns {CcTagPreview}
 */
export const CcTagPreview = document => {
  const ccTagPreview = document.getElementById(CC_TAG_PREVIEW_ID);

  /**
   * @param {string} lang
   */
  const setLanguage = lang => {
    ccTagPreview.textContent = lang.toUpperCase() + ' CC'
  }

  const setTxtColor = txtColor => {
    ccTagPreview.style.color = txtColor;
  }

  const setBackgroundColor = bgColor => {
    ccTagPreview.style.background = bgColor;
  }

  const setFontSize = fontSize => {
    ccTagPreview.style.fontSize = `calc(${fontSize} - 0.4rem)` 
  }

  return {
    setLanguage,
    setTxtColor,
    setBackgroundColor,
    setFontSize
  }
};