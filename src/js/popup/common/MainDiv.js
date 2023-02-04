import { CC_PREVIEW_BACKGROUND_COLOR_DISPLAY_ID } from "../CcPreviewBackgroundColor/CcPreviewBackgroundColorDisplay.js"
import { CC_PREVIEW_BACKGROUND_COLOR_PICKER_ID } from "../CcPreviewBackgroundColor/CcPreviewBackgroundColorPicker.js"
import { CcPreviewBackgroundColorPresenter } from "../CcPreviewBackgroundColor/CcPreviewBackgroundColorPresenter.js"
import { COLOR_TXT_DISPLAY_ID } from "../textColor/ColorTxtDisplay.js"
import { COLOR_TXT_PICKER_ID } from "../textColor/ColorTxtPicker.js"
import { ColorTxtPresenter } from "../textColor/ColorTxtPresenter.js"

const MAIN_DIV_ID = 'main'

/**
 * @typedef {Object} MainDiv
 * @property {(ccPreviewBackgroundColorPresenter: CcPreviewBackgroundColorPresenter, colorTxtPresenter: ColorTxtPresenter) => void} init
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
   * @param {ColorTxtPresenter} colorTxtPresenter
   */
  const init = (ccPreviewBackgroundColorPresenter, colorTxtPresenter) => {
    mainDiv.onclick = e => {
      const el = e.target;

      if (!isChildOf(el, CC_PREVIEW_BACKGROUND_COLOR_DISPLAY_ID) && !isChildOf(el, CC_PREVIEW_BACKGROUND_COLOR_PICKER_ID)) {
        ccPreviewBackgroundColorPresenter.hideBackgroundColorPicker()
      }

      if (!isChildOf(el, COLOR_TXT_PICKER_ID) && !isChildOf(el, COLOR_TXT_DISPLAY_ID)) {
        colorTxtPresenter.hideTextColorPicker()
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
