import { CcTagBackgroundColorPresenter } from './CcTagBackgroundColorPresenter.js'

export const CC_PREVIEW_BACKGROUND_COLOR_DISPLAY_ID = 'color-bg-display'

export class CcTagBackgroundColorDisplay {
  constructor(document) {
    this.document = document
    this.backgroundColorDisplay = this.document.getElementById(
      CC_PREVIEW_BACKGROUND_COLOR_DISPLAY_ID,
    )
  }

  /**
   * init function
   * @param {CcTagBackgroundColorPresenter} presenter
   */
  init(presenter) {
    this.backgroundColorDisplay.onclick = () => {
      presenter.toggleBackgroundColorPicker()
    }
  }

  setColor(color) {
    this.backgroundColorDisplay.style.background = color
  }
}
