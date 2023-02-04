import { CC_PREVIEW_BACKGROUND_COLOR_DISPLAY_ID } from "../CcPreviewBackgroundColor/CcPreviewBackgroundColorDisplay.js"
import { CC_PREVIEW_BACKGROUND_COLOR_PICKER_ID } from "../CcPreviewBackgroundColor/CcPreviewBackgroundColorPicker.js"
import { CcPreviewBackgroundColorPresenter } from "../CcPreviewBackgroundColor/CcPreviewBackgroundColorPresenter.js"
import { CC_PREVIEW_TEXT_COLOR_DISPLAY_ID } from "../textColor/CcPreviewTextColorDisplay.js"
import { CC_PREVIEW_TEXT_COLOR_PICKER_ID } from "../textColor/CcPreviewTextColorPicker.js"
import { CcPreviewTextColorPresenter } from "../textColor/CcPreviewTextColorPresenter.js"

const MAIN_DIV_ID = 'main'

/**
 * @typedef {Object} MainDiv
 * @property {(ccPreviewBackgroundColorPresenter: CcPreviewBackgroundColorPresenter, ccPreviewTextColorPresenter: CcPreviewTextColorPresenter) => void} init
 */

/**
 * CC Preview Background Color Display Element
 * @param {Document} document 
 * @returns {MainDiv}
 */
export const MainDiv = document => {
  const mainDiv = document.getElementById(MAIN_DIV_ID)

  /**
   * init function
   * @param {CcPreviewBackgroundColorPresenter} ccPreviewBackgroundColorPresenter
   * @param {CcPreviewTextColorPresenter} ccPreviewTextColorPresenter
   */
  const init = (ccPreviewBackgroundColorPresenter, ccPreviewTextColorPresenter) => {
    mainDiv.onclick = e => {
      const el = e.target;

      if (!isChildOf(el, CC_PREVIEW_BACKGROUND_COLOR_DISPLAY_ID) && !isChildOf(el, CC_PREVIEW_BACKGROUND_COLOR_PICKER_ID)) {
        ccPreviewBackgroundColorPresenter.hideBackgroundColorPicker()
      }

      if (!isChildOf(el, CC_PREVIEW_TEXT_COLOR_PICKER_ID) && !isChildOf(el, CC_PREVIEW_TEXT_COLOR_DISPLAY_ID)) {
        ccPreviewTextColorPresenter.hideTextColorPicker()
      }
    }
  }

  /**
   * get is child of parent that have parentId
   * @param {HTMLElement} el 
   * @param {*} parentId 
   */
  const isChildOf = (el, parentId) => {
    let currEl = el
    while (currEl) {
      if (currEl.id == parentId) {
        return true
      }

      currEl = currEl.parentElement
    }

    return false
  }

  return {
    init
  }
}
