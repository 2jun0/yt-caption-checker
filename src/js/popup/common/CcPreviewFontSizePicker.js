import { CcPreviewFontSizePresenter } from "./CcPreviewFontSizePresenter.js"

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
 * @typedef {Object} CcPreviewFontSizePicker
 * @property {(presenter: CcPreviewFontSizePresenter) => void} init
 * @property {function} setFontSize
 */

/**
 * CC Preview Size Picker Element
 * @param {Document} document 
 * @returns {CcPreviewFontSizePicker}
 */
export const CcPreviewFontSizePicker = document => {
  const ccPreviewFontSizePicker = document.getElementById(CC_PREVIEW_FONT_SIZE_PICKER_ID)

  /**
   * init function
   * @param {CcPreviewFontSizePresenter} presenter
   */
  const init = presenter => {
    ccPreviewFontSizePicker.min = 0
    ccPreviewFontSizePicker.max = FONT_SIZES.length - 1
    ccPreviewFontSizePicker.value = 3
    ccPreviewFontSizePicker.oninput = () => {
      const currentFontSize = FONT_SIZES[ccPreviewFontSizePicker.value]
      presenter.setFontSize(currentFontSize)
    }
  }

  const setFontSize = fontSize => {
    ccPreviewFontSizePicker.value = FONT_SIZES.indexOf(fontSize)
  }

  return {
    init,
    setFontSize
  }
}