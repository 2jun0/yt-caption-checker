import { CcPreviewTextColorPresenter } from "./CcPreviewTextColorPresenter.js"

export const CC_PREVIEW_TEXT_COLOR_DISPLAY_ID = 'color-txt-display'

/**
 * @typedef {Object} CcPreviewTextColorDisplay
 * @property {(presenter: CcPreviewTextColorPresenter) => void} init
 * @property {(color: any) => void} setColor
 */

/**
 * CC Preview Text Color Display Element
 * @param {Document} document 
 * @returns {CcPreviewTextColorDisplay}
 */
export const CcPreviewTextColorDisplay = document => {
  const textColorDisplay = document.getElementById(CC_PREVIEW_TEXT_COLOR_DISPLAY_ID);
  
  /**
   * init function
   * @param {CcPreviewTextColorPresenter} presenter 
   */
  const init = presenter => {
    textColorDisplay.onclick = () => {
      presenter.toggleTextColorPicker()
    }
  }

  const setColor = color => {
    textColorDisplay.style.background = color;
  }

  return {
    init,
    setColor
  }
}
