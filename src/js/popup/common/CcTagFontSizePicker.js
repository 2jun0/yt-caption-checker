import { CcTagFontSizePresenter } from './CcTagFontSizePresenter.js'

const CC_PREVIEW_FONT_SIZE_PICKER_ID = 'tag-size-range'
const FONT_SIZES = [
  '1.0rem',
  '1.1rem',
  '1.2rem',
  '1.3rem',
  '1.4rem',
  '1.5rem',
  '1.6rem',
]

export class CcTagFontSizePicker {
  constructor(document) {
    this.ccTagFontSizePicker = document.getElementById(
      CC_PREVIEW_FONT_SIZE_PICKER_ID,
    )
  }

  /**
   * Initialize
   * @param {CcTagFontSizePresenter} presenter
   */
  init(presenter) {
    this.ccTagFontSizePicker.min = 0
    this.ccTagFontSizePicker.max = FONT_SIZES.length - 1
    this.ccTagFontSizePicker.value = 3
    this.ccTagFontSizePicker.oninput = () => {
      const currentFontSize = FONT_SIZES[this.ccTagFontSizePicker.value]
      presenter.setFontSize(currentFontSize)
    }
  }

  setFontSize(fontSize) {
    this.ccTagFontSizePicker.value = FONT_SIZES.indexOf(fontSize)
  }
}
