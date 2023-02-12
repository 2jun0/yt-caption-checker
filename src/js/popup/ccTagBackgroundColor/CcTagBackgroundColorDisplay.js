import { CcTagBackgroundColorPresenter } from './CcTagBackgroundColorPresenter.js'

export const CC_PREVIEW_BACKGROUND_COLOR_DISPLAY_ID = 'color-bg-display'

/**
 * @typedef {Object} CcTagBackgroundColorDisplay
 * @property {(presenter: CcTagBackgroundColorPresenter) => void} init
 * @property {(color: any) => void} setColor
 */

/**
 * CC Tag Background Color Display Element
 * @param {Document} document
 * @returns {CcTagBackgroundColorDisplay}
 */
export const CcTagBackgroundColorDisplay = document => {
  const backgroundColorDisplay = document.getElementById(
    CC_PREVIEW_BACKGROUND_COLOR_DISPLAY_ID,
  )

  /**
   * init function
   * @param {CcTagBackgroundColorPresenter} presenter
   */
  const init = presenter => {
    backgroundColorDisplay.onclick = () => {
      presenter.toggleBackgroundColorPicker()
    }
  }

  const setColor = color => {
    backgroundColorDisplay.style.background = color
  }

  return {
    init,
    setColor,
  }
}
