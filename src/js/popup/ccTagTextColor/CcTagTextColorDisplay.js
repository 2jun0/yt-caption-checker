import { CcTagTextColorPresenter } from './CcTagTextColorPresenter.js'

export const CC_PREVIEW_TEXT_COLOR_DISPLAY_ID = 'color-txt-display'

export class CcTagTextColorDisplay {
  constructor(document) {
    /** @type {HTMLElement} */
    this.textColorDisplay = document.getElementById(
      CC_PREVIEW_TEXT_COLOR_DISPLAY_ID,
    )
  }

  /**
   * Initialize
   * @param {CcTagTextColorPresenter} presenter
   */
  init(presenter) {
    this.textColorDisplay.onclick = () => {
      presenter.toggleTextColorPicker()
    }
  }

  setColor(color) {
    this.textColorDisplay.style.background = color
  }
}
