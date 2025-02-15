import { MessageManager } from '../../utils/MessageManager.js'
import { Storage } from '../../store/Storage.js'
import { IS_FILTERING_VIDEOS_FIELD } from '../../store/contants.js'

export class YtFilterVideoModel {
  /** @type {Storage} */
  _storage = null
  /** @type {MessageManager} */
  _messageManager = null

  /**
   * Initialize
   * @param {Storage} storage
   * @param {MessageManager} messageManager
   */
  init(storage, messageManager) {
    this._storage = storage
    this._messageManager = messageManager
  }

  async setFilterVideos(isFilteringVideos) {
    await this._storage.saveDataAsync(
      IS_FILTERING_VIDEOS_FIELD,
      isFilteringVideos,
    )
    this._messageManager.sendMessage(
      IS_FILTERING_VIDEOS_FIELD,
      isFilteringVideos,
    )
  }
}
