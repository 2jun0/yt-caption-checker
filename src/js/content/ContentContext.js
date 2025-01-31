import { MessageManager } from '../utils/MessageManager.js'
import {
  CC_PREVIEW_FONT_SIZE_FIELD,
  COLOR_BG_FIELD,
  COLOR_TXT_FIELD,
  DEFAULT_VALUE,
  IS_COMBINED_REGION_FIELD,
  LANGUAGE_FIELD,
} from '../utils/storage.js'
import { CcTagModel } from './model/CcTagModel.js'
import { CcTagFactory } from './presenter/CcTagFactory.js'
import { CcTagFinder } from './presenter/CcTagFinder.js'
import { CcTagPresenter } from './presenter/CcTagPresenter.js'
import { ContentMessageListener } from './presenter/ContentMessageListener.js'
import { YtThumbnailViewManager } from './presenter/YtThumbnailViewManager.js'
import { YtMutationHandler } from './presenter/YtMutationHandler.js'

/**
 * @typedef {Object} ContentContext
 * @property {function} init
 * @property {() => CcTagPresenter} ccTagPresenter
 */

/**
 * Content Script Context
 * @returns {ContentContext}
 */
export const ContentContext = document => {
  /** model */
  /** @type {CcTagModel} */
  let _ccTagModel = null

  /** view */
  /** @type {YtMutationHandler} */
  let _ytMutationHandler = null

  /** presenter */
  /** @type {CcTagFactory} */
  let _ccTagFactory = null
  /** @type {CcTagFinder} */
  let _ccTagFinder = null
  /** @type {CcTagPresenter} */
  let _ccTagPresenter = null
  /** @type {ContentMessageListener} */
  let _contentMessageListener = null
  /** @type {YtThumbnailViewManager} */
  let _ytThumbnailViewManager = null

  /** others */
  /** @type {MessageManager} */
  let _messageManager = null
  /** @type {MutationObserver} */
  let _mutationObserver = null

  const init = () => {
    ccTagModel()
    ccTagFactory()
    ccTagFinder()
    ccTagPresenter()
    ytThumbnailViewManager()
    messageManager()
    mutationObserver()
  }

  /** model */
  const ccTagModel = () => {
    if (!_ccTagModel) {
      _ccTagModel = CcTagModel(
        DEFAULT_VALUE[COLOR_BG_FIELD],
        DEFAULT_VALUE[COLOR_TXT_FIELD],
        DEFAULT_VALUE[CC_PREVIEW_FONT_SIZE_FIELD],
        DEFAULT_VALUE[LANGUAGE_FIELD],
        DEFAULT_VALUE[IS_COMBINED_REGION_FIELD],
      )
    }

    return _ccTagModel
  }

  /** view */
  const ytMutationHandler = () => {
    if (!_ytMutationHandler) {
      _ytMutationHandler = YtMutationHandler(ccTagPresenter())
    }

    return _ytMutationHandler
  }

  /** presenter */
  const ccTagFactory = () => {
    if (!_ccTagFactory) {
      _ccTagFactory = new CcTagFactory(document)
    }

    return _ccTagFactory
  }

  const ccTagFinder = () => {
    if (!_ccTagFinder) {
      _ccTagFinder = new CcTagFinder(document)
    }

    return _ccTagFinder
  }

  const ccTagPresenter = () => {
    if (!_ccTagPresenter) {
      _ccTagPresenter = new CcTagPresenter(
        ccTagFactory(),
        ccTagFinder(),
        ytThumbnailViewManager(),
        ccTagModel(),
      )
    }

    return _ccTagPresenter
  }

  const contentMessageListener = () => {
    if (!_contentMessageListener) {
      _contentMessageListener = ContentMessageListener(ccTagPresenter())
    }

    return _contentMessageListener
  }

  const ytThumbnailViewManager = () => {
    if (!_ytThumbnailViewManager) {
      _ytThumbnailViewManager = YtThumbnailViewManager(document)
    }

    return _ytThumbnailViewManager
  }

  /** common */
  const messageManager = () => {
    if (!_messageManager) {
      _messageManager = MessageManager()
      _messageManager.addOnMessageListener(contentMessageListener())
    }

    return _messageManager
  }

  const mutationObserver = () => {
    if (!_mutationObserver) {
      _mutationObserver = new MutationObserver(ytMutationHandler())
      _mutationObserver.observe(document.body, {
        subtree: true,
        attributeFilter: ['href'],
      })
    }

    return _mutationObserver
  }

  return {
    init,
    ccTagPresenter,
  }
}
