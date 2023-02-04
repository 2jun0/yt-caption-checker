import { CcPreviewBackgroundColorPresenter } from "./CcPreviewBackgroundColorPresenter.js";

export const CC_PREVIEW_BACKGROUND_COLOR_DISPLAY_ID = 'color-bg-display'

/**
 * @typedef {Object} CcPreviewBackgroundColorDisplay
 * @property {(presenter: CcPreviewBackgroundColorPresenter) => void} init
 * @property {(color: any) => void} setColor
 */

/**
 * CC Preview Background Color Display Element
 * @param {Document} document 
 * @returns {CcPreviewBackgroundColorDisplay}
 */
export const CcPreviewBackgroundColorDisplay = document => {
  const backgroundColorDisplay = document.getElementById(CC_PREVIEW_BACKGROUND_COLOR_DISPLAY_ID);

  /**
   * init function
   * @param {CcPreviewBackgroundColorPresenter} presenter
   */
  const init = presenter => {
    backgroundColorDisplay.onclick = () => {
      presenter.toggleBackgroundColorPicker()
    }
  }

  const setColor = color => {
    backgroundColorDisplay.style.background = color;
  }

  return {
    init,
    setColor
  }
}
