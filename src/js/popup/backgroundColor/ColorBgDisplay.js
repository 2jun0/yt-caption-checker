import { ColorBgPresenter } from "./ColorBgPresenter";

export const COLOR_BG_DISPLAY_ID = 'color-bg-display'

/**
 * @typedef {Object} ColorBgDisplay
 * @property {(presenter: ColorBgPresenter) => void} init
 * @property {(color: any) => void} setColor
 */

/**
 * CC Preview Background Color Display Element
 * @param {Document} document 
 * @returns {ColorBgDisplay}
 */
export const ColorBgDisplay = document => {
  const colorBgDisplay = document.getElementById(COLOR_BG_DISPLAY_ID);

  /**
   * init function
   * @param {ColorBgPresenter} presenter
   */
  const init = presenter => {
    colorBgDisplay.onclick = () => {
      presenter.toggleBackgroundColorPicker()
    }
  }

  const setColor = color => {
    colorBgDisplay.style.background = color;
  }

  return {
    init,
    setColor
  }
}
