const CCSTATUS_EXAMPLE_ID = 'cc-status-example'

/**
 * @typedef {Object} CcStatusExample
 * @property {function} setLanguage
 * @property {function} setTxtColor
 * @property {function} setBackgroundColor
 * @property {function} setFontSize
 */

/**
 * CC Previce Example Element
 * @param {Document} document 
 * @returns {CcStatusExample}
 */
export const CcStatusExample = document => {
  const ccStatusExample = document.getElementById(CCSTATUS_EXAMPLE_ID);

  /**
   * @param {string} lang
   */
  const setLanguage = lang => {
    ccStatusExample.textContent = lang.toUpperCase() + ' CC'
  }

  const setTxtColor = txtColor => {
    ccStatusExample.style.color = txtColor;
  }

  const setBackgroundColor = bgColor => {
    ccStatusExample.style.background = bgColor;
  }

  const setFontSize = fontSize => {
    ccStatusExample.style.fontSize = `calc(${fontSize} - 0.4rem)` 
  }

  return {
    setLanguage,
    setTxtColor,
    setBackgroundColor,
    setFontSize
  }
};