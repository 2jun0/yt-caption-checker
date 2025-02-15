import { YtFilterVideosPresenter } from './YtFilterVideosPresenter.js'

const FILTER_VIDEOS_CHECK_BOX_ID = 'filter-videos-checkbox'

export class YtFilterVideosCheckBox {
  /** @type {HTMLInputElement} */
  _filterVideosCheckBox = null

  /**
   * Constructor
   * @param {Document} document
   */
  constructor(document) {
    this._filterVideosCheckBox = document.getElementById(
      FILTER_VIDEOS_CHECK_BOX_ID,
    )
  }

  /**
   * init class
   * @param {YtFilterVideosPresenter} presenter
   */
  init(presenter) {
    this._filterVideosCheckBox.onchange = () => {
      presenter.setFilterVideos(this._filterVideosCheckBox.checked)
    }
  }

  setFilterVideos(isFilteringVideos) {
    this._filterVideosCheckBox.checked = isFilteringVideos
  }

  isChecked() {
    return this._filterVideosCheckBox.checked
  }
}
