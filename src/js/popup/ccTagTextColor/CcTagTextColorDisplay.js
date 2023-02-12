import { CcTagTextColorPresenter } from './CcTagTextColorPresenter.js'

export const CC_PREVIEW_TEXT_COLOR_DISPLAY_ID = 'color-txt-display'

/**
 * @typedef {Object} CcTagTextColorDisplay
 * @property {(presenter: CcTagTextColorPresenter) => void} init
 * @property {(color: any) => void} setColor
 */

/**
 * CC Tag Text Color Display Element
 * @param {Document} document
 * @returns {CcTagTextColorDisplay}
 */
export const CcTagTextColorDisplay = document => {
  const textColorDisplay = document.getElementById(
    CC_PREVIEW_TEXT_COLOR_DISPLAY_ID,
  )

  /**
   * init function
   * @param {CcTagTextColorPresenter} presenter
   */
  const init = presenter => {
    textColorDisplay.onclick = () => {
      presenter.toggleTextColorPicker()
    }
  }

  const setColor = color => {
    textColorDisplay.style.background = color
  }

  return {
    init,
    setColor,
  }
}
