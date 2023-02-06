import { CC_PREVIEW_BACKGROUND_COLOR_DISPLAY_ID } from "../ccTagBackgroundColor/CcTagBackgroundColorDisplay.js"
import { CC_PREVIEW_BACKGROUND_COLOR_PICKER_ID } from "../ccTagBackgroundColor/CcTagBackgroundColorPicker.js"
import { CcTagBackgroundColorPresenter } from "../ccTagBackgroundColor/CcTagBackgroundColorPresenter.js"
import { CC_PREVIEW_TEXT_COLOR_DISPLAY_ID } from "../ccTagTextColor/CcTagTextColorDisplay.js"
import { CC_PREVIEW_TEXT_COLOR_PICKER_ID } from "../ccTagTextColor/CcTagTextColorPicker.js"
import { CcTagTextColorPresenter } from "../ccTagTextColor/CcTagTextColorPresenter.js"

const MAIN_DIV_ID = 'main'

/**
 * @typedef {Object} MainDiv
 * @property {(ccTagBackgroundColorPresenter: CcTagBackgroundColorPresenter, ccTagTextColorPresenter: CcTagTextColorPresenter) => void} init
 */

/**
 * CC Tag Background Color Display Element
 * @param {Document} document 
 * @returns {MainDiv}
 */
export const MainDiv = document => {
  const mainDiv = document.getElementById(MAIN_DIV_ID)

  /**
   * init function
   * @param {CcTagBackgroundColorPresenter} ccTagBackgroundColorPresenter
   * @param {CcTagTextColorPresenter} ccTagTextColorPresenter
   */
  const init = (ccTagBackgroundColorPresenter, ccTagTextColorPresenter) => {
    mainDiv.onclick = e => {
      const el = e.target;

      if (!isChildOf(el, CC_PREVIEW_BACKGROUND_COLOR_DISPLAY_ID) && !isChildOf(el, CC_PREVIEW_BACKGROUND_COLOR_PICKER_ID)) {
        ccTagBackgroundColorPresenter.hideBackgroundColorPicker()
      }

      if (!isChildOf(el, CC_PREVIEW_TEXT_COLOR_PICKER_ID) && !isChildOf(el, CC_PREVIEW_TEXT_COLOR_DISPLAY_ID)) {
        ccTagTextColorPresenter.hideTextColorPicker()
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
