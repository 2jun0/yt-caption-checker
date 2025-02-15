import { MessageManager } from '../utils/MessageManager.js'
import {
  CC_PREVIEW_FONT_SIZE_FIELD,
  COLOR_BG_FIELD,
  COLOR_TXT_FIELD,
  IS_COMBINED_REGION_FIELD,
  LANGUAGE_FIELD,
} from '../store/contants.js'
import { DEFAULT_VALUE } from '../store/Storage.js'
import { CcTagModel } from './model/CcTagModel.js'
import { CcTagFactory } from './presenter/CcTagFactory.js'
import { CcTagFinder } from './presenter/CcTagFinder.js'
import { CcTagPresenter } from './presenter/CcTagPresenter.js'
import { ContentMessageListener } from './presenter/ContentMessageListener.js'
import { YtThumbnailViewManager } from './presenter/YtThumbnailViewManager.js'
import { YtMutationHandler } from './presenter/YtMutationHandler.js'

export class ContentContext {
  /** model */
  /** @type {CcTagModel} */
  _ccTagModel = null

  /** view */
  /** @type {YtMutationHandler} */
  _ytMutationHandler = null

  /** presenter */
  /** @type {CcTagFactory} */
  _ccTagFactory = null
  /** @type {CcTagFinder} */
  _ccTagFinder = null
  /** @type {CcTagPresenter} */
  _ccTagPresenter = null
  /** @type {ContentMessageListener} */
  _contentMessageListener = null
  /** @type {YtThumbnailViewManager} */
  _ytThumbnailViewManager = null

  /** others */
  /** @type {MessageManager} */
  _messageManager = null
  /** @type {MutationObserver} */
  _mutationObserver = null

  constructor(document) {
    this.document = document
  }

  init() {
    this.ccTagModel()
    this.ccTagFactory()
    this.ccTagFinder()
    this.ccTagPresenter()
    this.ytThumbnailViewManager()
    this.messageManager()
    this.mutationObserver()
  }

  /** model */
  ccTagModel() {
    if (!this._ccTagModel) {
      this._ccTagModel = new CcTagModel(
        DEFAULT_VALUE[COLOR_BG_FIELD],
        DEFAULT_VALUE[COLOR_TXT_FIELD],
        DEFAULT_VALUE[CC_PREVIEW_FONT_SIZE_FIELD],
        DEFAULT_VALUE[LANGUAGE_FIELD],
        DEFAULT_VALUE[IS_COMBINED_REGION_FIELD],
      )
    }
    return this._ccTagModel
  }

  /** view */
  ytMutationHandler() {
    if (!this._ytMutationHandler) {
      this._ytMutationHandler = new YtMutationHandler(this.ccTagPresenter())
    }
    return this._ytMutationHandler
  }

  /** presenter */
  ccTagFactory() {
    if (!this._ccTagFactory) {
      this._ccTagFactory = new CcTagFactory(this.document)
    }
    return this._ccTagFactory
  }

  ccTagFinder() {
    if (!this._ccTagFinder) {
      this._ccTagFinder = new CcTagFinder(this.document)
    }
    return this._ccTagFinder
  }

  ccTagPresenter() {
    if (!this._ccTagPresenter) {
      this._ccTagPresenter = new CcTagPresenter(
        this.ccTagFactory(),
        this.ccTagFinder(),
        this.ytThumbnailViewManager(),
        this.ccTagModel(),
      )
    }
    return this._ccTagPresenter
  }

  contentMessageListener() {
    if (!this._contentMessageListener) {
      this._contentMessageListener = new ContentMessageListener(
        this.ccTagPresenter(),
      )
    }
    return this._contentMessageListener
  }

  ytThumbnailViewManager() {
    if (!this._ytThumbnailViewManager) {
      this._ytThumbnailViewManager = new YtThumbnailViewManager(this.document)
    }
    return this._ytThumbnailViewManager
  }

  /** common */
  messageManager() {
    if (!this._messageManager) {
      this._messageManager = new MessageManager()
      this._messageManager.addOnMessageListener(this.contentMessageListener())
    }
    return this._messageManager
  }

  mutationObserver() {
    if (!this._mutationObserver) {
      let ytHandler = this.ytMutationHandler()
      this._mutationObserver = new MutationObserver(
        ytHandler.handleMutations.bind(ytHandler),
      )
      this._mutationObserver.observe(this.document.body, {
        subtree: true,
        childList: true,
        attributeFilter: ['href'],
      })
    }
    return this._mutationObserver
  }
}
