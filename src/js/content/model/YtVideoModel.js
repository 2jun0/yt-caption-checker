export class YtVideoModel {
  /**
   * @param {boolean} isFilteringVideos
   */
  constructor(isFilteringVideos) {
    this._isFilteringVideos = isFilteringVideos
  }

  setFilteringVideos(filteringVideos) {
    this._isFilteringVideos = filteringVideos
  }

  get isFilteringVideos() {
    return this._isFilteringVideos
  }
}
