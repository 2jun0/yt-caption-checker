import { CcTagLanguagePresenter } from './CcTagLanguagePresenter.js'

const COMBINE_REGION_CHECK_BOX_ID = 'combine-region-checkbox'

/**
 * @typedef {Object} CcTagCombineRegionCheckBox
 * @property {(presenter: CcTagLanguagePresenter) => void} init
 * @property {function} setCombineRegion
 * @property {function} isChecked
 */

/**
 * CC Tag Combine Region Checkbox Element
 * @param {Document} document
 * @returns {CcTagCombineRegionCheckBox}
 */
export const CcTagCombineRegionCheckBox = document => {
  const combineRegionCheckBox = document.getElementById(
    COMBINE_REGION_CHECK_BOX_ID,
  )

  /**
   * init function
   * @param {CcTagLanguagePresenter} presenter
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
    isChecked,
  }
}
