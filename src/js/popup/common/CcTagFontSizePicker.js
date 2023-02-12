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

/**
 * @typedef {Object} CcTagFontSizePicker
 * @property {(presenter: CcTagFontSizePresenter) => void} init
 * @property {function} setFontSize
 */

/**
 * CC Tag Size Picker Element
 * @param {Document} document
 * @returns {CcTagFontSizePicker}
 */
export const CcTagFontSizePicker = document => {
  const ccTagFontSizePicker = document.getElementById(
    CC_PREVIEW_FONT_SIZE_PICKER_ID,
  )

  /**
   * init function
   * @param {CcTagFontSizePresenter} presenter
   */
  const init = presenter => {
    ccTagFontSizePicker.min = 0
    ccTagFontSizePicker.max = FONT_SIZES.length - 1
    ccTagFontSizePicker.value = 3
    ccTagFontSizePicker.oninput = () => {
      const currentFontSize = FONT_SIZES[ccTagFontSizePicker.value]
      presenter.setFontSize(currentFontSize)
    }
  }

  const setFontSize = fontSize => {
    ccTagFontSizePicker.value = FONT_SIZES.indexOf(fontSize)
  }

  return {
    init,
    setFontSize,
  }
}
