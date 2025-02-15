import { YtFilterVideosCheckBox } from './YtFilterVideosCheckBox.js'
import { YtFilterVideoModel } from './YtFilterVidoesModel.js'

export class YtFilterVideosPresenter {
  /** @type {YtFilterVideosCheckBox} */
  _ytFilterVideosCheckbox = null
  /** @type {YtFilterVideoModel} */
  _ytFilterVideosModel = null

  /**
   * Init
   * @param {YtFilterVideosCheckBox} ytFilterVideosCheckBox
   * @param {YtFilterVideoModel} model
   */
  init(ytFilterVideosCheckBox, model) {
    this._ytFilterVideosCheckbox = ytFilterVideosCheckBox
    this._ytFilterVideosModel = model
  }

  async setFilterVideos(isFilteringVideos) {
    await this._ytFilterVideosModel.setFilterVideos(isFilteringVideos)
    this._ytFilterVideosCheckbox.setFilterVideos(isFilteringVideos)
  }
}
