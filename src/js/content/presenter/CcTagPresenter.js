import { CcTagFactory } from './CcTagFactory.js'
import { CcTagFinder } from './CcTagFinder.js'
import { CcTagModel } from '../model/CcTagModel.js'
import { YtThumbnailViewManager } from './YtThumbnailViewManager.js'
import { YtThumbnailView } from '../view/YtThumbnailView.js'
import { YtVideoModel } from '../model/YtVideoModel.js'
import { YtPlaylistView } from '../view/YtPlaylistView.js'

export class CcTagPresenter {
  /**
   * @param {CcTagFactory} ccTagFactory
   * @param {CcTagFinder} ccTagFinder
   * @param {YtThumbnailViewManager} ytThumbnailViewManager
   * @param {CcTagModel} ccTagModel
   * @param {YtVideoModel} ytVideoModel
   */
  constructor(
    ccTagFactory,
    ccTagFinder,
    ytThumbnailViewManager,
    ccTagModel,
    ytVideoModel,
  ) {
    this.ccTagFactory = ccTagFactory
    this.ccTagFinder = ccTagFinder
    this.ytThumbnailViewManager = ytThumbnailViewManager
    this.ccTagModel = ccTagModel
    this.ytVideoModel = ytVideoModel
  }

  /**
   * on thumbnail added
   * @param {YtThumbnailView} ytThumbnailView
   */
  async onThumbnailAdded(ytThumbnailView) {
    await this.updateVisible(ytThumbnailView)

    if (await ytThumbnailView.hasCcTag()) {
      return
    }

    await this.checkCaptionsAndCreateCcTag(ytThumbnailView)
  }

  /**
   * on playlist added
   * @param {YtPlaylistView} ytPlaylistView
   */
  async onPlaylistAdded(ytPlaylistView) {
    await ytPlaylistView.setVisible(!this.ytVideoModel.isFilteringVideos)
  }

  /**
   * on background color updated
   * @param {string} backgroundColor
   */
  onBackgroundColorUpdated(backgroundColor) {
    this.ccTagModel.setBackgroundColor(backgroundColor)
    this.ccTagFinder.findAllCcTagViews().forEach(ccTagView => {
      ccTagView.setBackgroundColor(backgroundColor)
    })
  }

  /**
   * on text color updated
   * @param {string} textColor
   */
  onTextColorUpdated(textColor) {
    this.ccTagModel.setTextColor(textColor)
    this.ccTagFinder.findAllCcTagViews().forEach(ccTagView => {
      ccTagView.setTextColor(textColor)
    })
  }

  /**
   * on font size updated
   * @param {string} fontSize
   */
  onFontSizeUpdated(fontSize) {
    this.ccTagModel.setFontSize(fontSize)
    this.ccTagFinder.findAllCcTagViews().forEach(ccTagView => {
      ccTagView.setFontSize(fontSize)
    })
  }

  /**
   * on language updated
   * @param {string} language
   */
  async onLanguageUpdated(language) {
    if (this.ccTagModel.language == language) return

    this.ccTagModel.setLanguage(language)
    // remove previous all CC Tags
    this.removeAllCcTag()
    // check if it has captions and create cc tags
    const ytThumbnailViews = this.ytThumbnailViewManager.findAllThumbnailView()
    await Promise.all(
      ytThumbnailViews.map(this.checkCaptionsAndCreateCcTag.bind(this)),
    )
    // update thumbnails visible
    await Promise.all(ytThumbnailViews.map(this.updateVisible.bind(this)))
  }

  /**
   * on combine region updated
   * @param {boolean} isCombinedRegion
   */
  async onIsCombinedRegionUpdated(isCombinedRegion) {
    if (this.ccTagModel.isCombinedRegion == isCombinedRegion) return

    this.ccTagModel.setIsCombinedRegion(isCombinedRegion)
    // remove previous all CC Tags
    this.removeAllCcTag()
    // check if it has captions and create cc tags
    const ytThumbnailViews = this.ytThumbnailViewManager.findAllThumbnailView()
    await Promise.all(
      ytThumbnailViews.map(this.checkCaptionsAndCreateCcTag.bind(this)),
    )
    // update thumbnails visible
    await Promise.all(ytThumbnailViews.map(this.updateVisible.bind(this)))
  }

  /**
   * on filter videos updated
   * @param {boolean} isFilteringVideos
   */
  async onIsFilteringVideosUpdated(isFilteringVideos) {
    if (this.ytVideoModel.isFilteringVideos == isFilteringVideos) return

    this.ytVideoModel.setFilteringVideos(isFilteringVideos)

    await Promise.all(
      this.ytThumbnailViewManager
        .findAllPlaylistViews()
        .map(ytPlaylistView =>
          ytPlaylistView.setVisible(!this.ytVideoModel.isFilteringVideos),
        ),
    )
    await Promise.all(
      this.ytThumbnailViewManager
        .findAllThumbnailView()
        .map(this.updateVisible.bind(this)),
    )
  }

  /**
   * check if video has captions
   * and create cc tag
   * @param {YtThumbnailView} ytThumbnailView
   */
  async checkCaptionsAndCreateCcTag(ytThumbnailView) {
    const videoUrl = ytThumbnailView.videoUrl

    const languages = this.ccTagModel.relatedLanguages

    if (await this.ccTagModel.hasCaptions(videoUrl, languages)) {
      await ytThumbnailView.insertCcTag(this.createCcTag())
    }
  }

  /**
   * @param {YtThumbnailView} ytThumbnailView
   */
  async updateVisible(ytYhumbnailView) {
    if (this.ytVideoModel.isFilteringVideos) {
      ytYhumbnailView.setVisibleWithVideo(await ytYhumbnailView.hasCcTag())
    } else {
      ytYhumbnailView.setVisibleWithVideo(true)
    }
  }

  removeAllCcTag() {
    this.ccTagFinder.findAllCcTagViews().forEach(ccTagView => {
      ccTagView.remove()
    })
  }

  createCcTag() {
    return this.ccTagFactory.createCcTagView(
      this.ccTagModel.backgroundColor,
      this.ccTagModel.textColor,
      this.ccTagModel.fontSize,
      this.ccTagModel.shownLanguage,
    )
  }
}
