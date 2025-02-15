import { CcTagFactory } from './CcTagFactory.js'
import { CcTagFinder } from './CcTagFinder.js'
import { CcTagModel } from '../model/CcTagModel.js'
import { YtThumbnailViewManager } from './YtThumbnailViewManager.js'
import { YtThumbnailView } from '../view/YtThumbnailView.js'

export class CcTagPresenter {
  /**
   * @param {CcTagFactory} ccTagFactory
   * @param {CcTagFinder} ccTagFinder
   * @param {YtThumbnailViewManager} ytThumbnailViewManager
   * @param {CcTagModel} ccTagModel
   */
  constructor(ccTagFactory, ccTagFinder, ytThumbnailViewManager, ccTagModel) {
    this.ccTagFactory = ccTagFactory
    this.ccTagFinder = ccTagFinder
    this.ytThumbnailViewManager = ytThumbnailViewManager
    this.ccTagModel = ccTagModel
  }

  /**
   * on thumbnail added
   * @param {YtThumbnailView} ytThumbnailView
   */
  async onThumbnailAdded(ytThumbnailView) {
    if (!(await ytThumbnailView.hasCcTag())) {
      this.checkCaptionsAndCreateCcTag(ytThumbnailView)
    }
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
  onLanguageUpdated(language) {
    this.ccTagModel.setLanguage(language)
    // remove previous all CC Tags
    this.removeAllCcTag()
    // check if it has captions and create cc tags
    this.ytThumbnailViewManager
      .findAllThumbnailView()
      .forEach(this.checkCaptionsAndCreateCcTag.bind(this))
  }

  /**
   * on is combined region updated
   * @param {boolean} isCombinedRegion
   */
  onIsCombinedRegionUpdated(isCombinedRegion) {
    this.ccTagModel.setIsCombinedRegion(isCombinedRegion)
    // remove previous all CC Tags
    this.removeAllCcTag()
    // check if it has captions and create cc tags
    this.ytThumbnailViewManager
      .findAllThumbnailView()
      .forEach(this.checkCaptionsAndCreateCcTag.bind(this))
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
      ytThumbnailView.insertCcTag(this.createCcTag())
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
