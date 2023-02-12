import { CcTagFactory } from './CcTagFactory.js'
import { CcTagFinder } from './CcTagFinder.js'
import { CcTagModel } from '../model/CcTagModel.js'
import { YtThumbnailViewManager } from './YtThumbnailViewManager.js'
import { YtThumbnailView } from '../view/YtThumbnailView.js'

/**
 * @typedef {Object} CcTagPresenter
 * @property {(ytThumbnailView: YtThumbnailView) => void} onThumbnailAdded
 * @property {function} onBackgroundColorUpdated
 * @property {function} onTextColorUpdated
 * @property {function} onFontSizeUpdated
 * @property {function} onLanguageUpdated
 * @property {function} onIsCombinedRegionUpdated
 */

/**
 * CC Tag Presenter
 * @param {CcTagFactory} ccTagFactory
 * @param {CcTagFinder} ccTagFinder
 * @param {YtThumbnailViewManager} ytThumbnailViewManager
 * @param {CcTagModel} ccTagModel
 * @returns {CcTagPresenter}
 */
export const CcTagPresenter = (
  ccTagFactory,
  ccTagFinder,
  ytThumbnailViewManager,
  ccTagModel,
) => {
  /**
   * on thumbnail added
   * @param {YtThumbnailView} ytThumbnailView
   */
  const onThumbnailAdded = async ytThumbnailView => {
    if (!(await ytThumbnailView.hasCcTag())) {
      checkCaptionsAndCreateCcTag(ytThumbnailView)
    }
  }

  /**
   * on background color updated
   * @param {string} backgroundColor
   */
  const onBackgroundColorUpdated = backgroundColor => {
    ccTagModel.setBackgroundColor(backgroundColor)
    ccTagFinder.findAllCcTagViews().forEach(ccTagView => {
      ccTagView.setBackgroundColor(backgroundColor)
    })
  }

  /**
   * on text color updated
   * @param {string} textColor
   */
  const onTextColorUpdated = textColor => {
    ccTagModel.setTextColor(textColor)
    ccTagFinder.findAllCcTagViews().forEach(ccTagView => {
      ccTagView.setTextColor(textColor)
    })
  }

  /**
   * on font size updated
   * @param {string} fontSize
   */
  const onFontSizeUpdated = fontSize => {
    ccTagModel.setFontSize(fontSize)
    ccTagFinder.findAllCcTagViews().forEach(ccTagView => {
      ccTagView.setFontSize(fontSize)
    })
  }

  /**
   * on language updated
   * @param {string} language
   */
  const onLanguageUpdated = language => {
    ccTagModel.setLanguage(language)
    // remove previous all CC Tags
    removeAllCcTag()
    // check if it has captions and create cc tags
    ytThumbnailViewManager
      .findAllThumbnailView()
      .forEach(checkCaptionsAndCreateCcTag)
  }

  /**
   * on is combined region updated
   * @param {boolean} isCombinedRegion
   */
  const onIsCombinedRegionUpdated = isCombinedRegion => {
    ccTagModel.setIsCombinedRegion(isCombinedRegion)
    // remove previous all CC Tags
    removeAllCcTag()
    // check if it has captions and create cc tags
    ytThumbnailViewManager
      .findAllThumbnailView()
      .forEach(checkCaptionsAndCreateCcTag)
  }

  /**
   * check if video has captions
   * and create cc tag
   * @param {YtThumbnailView} ytThumbnailView
   */
  const checkCaptionsAndCreateCcTag = async ytThumbnailView => {
    const videoUrl = ytThumbnailView.getVideoUrl()
    // if thumbnail doesn't have url
    // pass, but IS IT REAL THUMBNAIL?
    if (!videoUrl) {
      return
    }

    const languages = ccTagModel.relatedLanguages()

    if (await ccTagModel.hasCaptions(videoUrl, languages)) {
      ytThumbnailView.insertCcTag(createCcTag())
    }
  }

  const removeAllCcTag = () => {
    ccTagFinder.findAllCcTagViews().forEach(ccTagView => {
      ccTagView.remove()
    })
  }

  const createCcTag = () => {
    return ccTagFactory.createCcTagView(
      ccTagModel.backgroundColor(),
      ccTagModel.textColor(),
      ccTagModel.fontSize(),
      ccTagModel.shownLanguage(),
    )
  }

  return {
    onThumbnailAdded,
    onBackgroundColorUpdated,
    onTextColorUpdated,
    onFontSizeUpdated,
    onLanguageUpdated,
    onIsCombinedRegionUpdated,
  }
}
