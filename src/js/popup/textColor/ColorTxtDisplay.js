import { ColorTxtPresenter } from "./ColorTxtPresenter.js"

export const COLOR_TXT_DISPLAY_ID = 'color-txt-display'

/**
 * @typedef {Object} ColorTxtDisplay
 * @property {(presenter: ColorTxtPresenter) => void} init
 * @property {(color: any) => void} setColor
 */

/**
 * CC Preview Text Color Display Element
 * @param {Document} document 
 * @returns {ColorTxtDisplay}
 */
export const ColorTxtDisplay = document => {
  const colorTxtDisplay = document.getElementById(COLOR_TXT_DISPLAY_ID);
  
  /**
   * init function
   * @param {ColorTxtPresenter} presenter 
   */
  const init = presenter => {
    colorTxtDisplay.onclick = () => {
      presenter.toggleTextColorPicker()
    }
  }

  const setColor = color => {
    colorTxtDisplay.style.background = color;
  }

  return {
    init,
    setColor
  }
}
