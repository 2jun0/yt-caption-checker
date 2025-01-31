import { CC_PREVIEW_BACKGROUND_COLOR_DISPLAY_ID } from '../ccTagBackgroundColor/CcTagBackgroundColorDisplay.js'
import { CC_PREVIEW_BACKGROUND_COLOR_PICKER_ID } from '../ccTagBackgroundColor/CcTagBackgroundColorPicker.js'
import { CcTagBackgroundColorPresenter } from '../ccTagBackgroundColor/CcTagBackgroundColorPresenter.js'
import { CC_PREVIEW_TEXT_COLOR_DISPLAY_ID } from '../ccTagTextColor/CcTagTextColorDisplay.js'
import { CC_PREVIEW_TEXT_COLOR_PICKER_ID } from '../ccTagTextColor/CcTagTextColorPicker.js'
import { CcTagTextColorPresenter } from '../ccTagTextColor/CcTagTextColorPresenter.js'

const MAIN_DIV_ID = 'main'

export class MainDiv {
  /** @type {HTMLElement} */
  _mainDiv = null

  /**
   * Constructor
   * @param {Document} document
   */
  constructor(document) {
    this._mainDiv = document.getElementById(MAIN_DIV_ID)
  }

  /**
   * Init function
   * @param {CcTagBackgroundColorPresenter} ccTagBackgroundColorPresenter
   * @param {CcTagTextColorPresenter} ccTagTextColorPresenter
   */
  init(ccTagBackgroundColorPresenter, ccTagTextColorPresenter) {
    this._mainDiv.onclick = e => {
      const el = e.target

      if (
        !this.isChildOf(el, CC_PREVIEW_BACKGROUND_COLOR_DISPLAY_ID) &&
        !this.isChildOf(el, CC_PREVIEW_BACKGROUND_COLOR_PICKER_ID)
      ) {
        ccTagBackgroundColorPresenter.hideBackgroundColorPicker()
      }

      if (
        !this.isChildOf(el, CC_PREVIEW_TEXT_COLOR_PICKER_ID) &&
        !this.isChildOf(el, CC_PREVIEW_TEXT_COLOR_DISPLAY_ID)
      ) {
        ccTagTextColorPresenter.hideTextColorPicker()
      }
    }
  }

  /**
   * Check if element is a child of a parent with a specific ID
   * @param {HTMLElement} el
   * @param {string} parentId
   * @returns {boolean}
   */
  isChildOf(el, parentId) {
    let currEl = el
    while (currEl) {
      if (currEl.id === parentId) {
        return true
      }
      currEl = currEl.parentElement
    }
    return false
  }
}
