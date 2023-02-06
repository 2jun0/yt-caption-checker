import { LanguagePresenter } from "./LanguagePresenter.js";

const COMBINE_REGION_CHECK_BOX_ID = 'combine-region-checkbox'

/**
 * @typedef {Object} CombineRegionCheckBox
 * @property {(presenter: LanguagePresenter) => void} init
 * @property {function} setCombineRegion
 * @property {function} isChecked
 */

/**
 * Combine Region Checkbox Element
 * @param {Document} document 
 * @returns {CombineRegionCheckBox}
 */
export const CombineRegionCheckBox = document => {
  const combineRegionCheckBox = document.getElementById(COMBINE_REGION_CHECK_BOX_ID)
  
  /**
   * init function
   * @param {LanguagePresenter} presenter
   */
  const init = presenter => {
    combineRegionCheckBox.onchange = () => {
      presenter.setCombineRegion(combineRegionCheckBox.checked)
    }
  }  

  const setCombineRegion = isCombinedRegion => {
    combineRegionCheckBox.checked = isCombinedRegion
  }

  const isChecked = () => {
    return combineRegionCheckBox.checked
  }

  return {
    init,
    setCombineRegion,
    isChecked
  }
}
