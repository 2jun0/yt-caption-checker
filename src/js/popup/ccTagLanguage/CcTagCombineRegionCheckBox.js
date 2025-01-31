import { CcTagLanguagePresenter } from './CcTagLanguagePresenter.js'

const COMBINE_REGION_CHECK_BOX_ID = 'combine-region-checkbox'

export class CcTagCombineRegionCheckBox {
  /** @type {HTMLInputElement} */
  _combineRegionCheckBox = null

  /**
   * Constructor
   * @param {Document} document
   */
  constructor(document) {
    this._combineRegionCheckBox = document.getElementById(
      COMBINE_REGION_CHECK_BOX_ID,
    )
  }

  /**
   * init class
   * @param {CcTagLanguagePresenter} presenter
   */
  init(presenter) {
    this._combineRegionCheckBox.onchange = () => {
      presenter.setCombineRegion(this._combineRegionCheckBox.checked)
    }
  }

  setCombineRegion(isCombinedRegion) {
    this._combineRegionCheckBox.checked = isCombinedRegion
  }

  isChecked() {
    return this._combineRegionCheckBox.checked
  }
}
