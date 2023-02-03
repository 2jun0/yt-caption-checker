import { COLOR_BG_DISPLAY_ID } from "../backgroundColor/ColorBgDisplay"
import { COLOR_BG_PICKER_ID } from "../backgroundColor/ColorBgPicker"
import { ColorBgPresenter } from "../backgroundColor/ColorBgPresenter"
import { COLOR_TXT_DISPLAY_ID } from "../textColor/ColorTxtDisplay"
import { COLOR_TXT_PICKER_ID } from "../textColor/ColorTxtPicker"
import { ColorTxtPresenter } from "../textColor/ColorTxtPresenter"

const MAIN_DIV_ID = 'main'

/**
 * @typedef {Object} MainDiv
 * @property {(colorBgPresenter: ColorBgPresenter, colorTxtPresenter: ColorTxtPresenter) => void} init
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
   * @param {ColorBgPresenter} colorBgPresenter
   * @param {ColorTxtPresenter} colorTxtPresenter
   */
  const init = (colorBgPresenter, colorTxtPresenter) => {
    mainDiv.onclick = e => {
      if (![COLOR_BG_PICKER_ID, COLOR_BG_DISPLAY_ID].includes(e.target.id)) {
        colorBgPresenter.hideBackgroundColorPicker()
      }

      if (![COLOR_TXT_PICKER_ID, COLOR_TXT_DISPLAY_ID].includes(e.target.id)) {
        colorTxtPresenter.hideTextColorPicker()
      }
    }
  }

  return {
    init
  }
}
