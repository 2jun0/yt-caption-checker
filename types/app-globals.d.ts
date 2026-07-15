declare global {
  type CaptionLoader = import('../src/js/background/CaptionLoader.js').CaptionLoader
  type CcTagBackgroundColorDisplay = import('../src/js/popup/ccTagBackgroundColor/CcTagBackgroundColorDisplay.js').CcTagBackgroundColorDisplay
  type CcTagBackgroundColorModel = import('../src/js/popup/ccTagBackgroundColor/CcTagBackgroundColorModel.js').CcTagBackgroundColorModel
  type CcTagBackgroundColorPicker = import('../src/js/popup/ccTagBackgroundColor/CcTagBackgroundColorPicker.js').CcTagBackgroundColorPicker
  type CcTagBackgroundColorPresenter = import('../src/js/popup/ccTagBackgroundColor/CcTagBackgroundColorPresenter.js').CcTagBackgroundColorPresenter
  type CcTagCombineRegionCheckBox = import('../src/js/popup/ccTagLanguage/CcTagCombineRegionCheckBox.js').CcTagCombineRegionCheckBox
  type CcLoadingView = import('../src/js/content/view/CcLoadingView.js').CcLoadingView
  type CcTagFactory = import('../src/js/content/presenter/CcTagFactory.js').CcTagFactory
  type CcTagFinder = import('../src/js/content/presenter/CcTagFinder.js').CcTagFinder
  type CcTagFontSizeModel = import('../src/js/popup/common/CcTagFontSizeModel.js').CcTagFontSizeModel
  type CcTagFontSizePicker = import('../src/js/popup/common/CcTagFontSizePicker.js').CcTagFontSizePicker
  type CcTagFontSizePresenter = import('../src/js/popup/common/CcTagFontSizePresenter.js').CcTagFontSizePresenter
  type CcTagLanguageModel = import('../src/js/popup/ccTagLanguage/CcTagLanguageModel.js').CcTagLanguageModel
  type CcTagLanguagePicker = import('../src/js/popup/ccTagLanguage/CcTagLanguagePicker.js').CcTagLanguagePicker
  type CcTagLanguagePresenter = import('../src/js/popup/ccTagLanguage/CcTagLanguagePresenter.js').CcTagLanguagePresenter
  type CcTagModel = import('../src/js/content/model/CcTagModel.js').CcTagModel
  type CcTagPresenter = import('../src/js/content/presenter/CcTagPresenter.js').CcTagPresenter
  type CcTagPreview = import('../src/js/popup/common/CcTagPreview.js').CcTagPreview
  type CcTagTextColorDisplay = import('../src/js/popup/ccTagTextColor/CcTagTextColorDisplay.js').CcTagTextColorDisplay
  type CcTagTextColorModel = import('../src/js/popup/ccTagTextColor/CcTagTextColorModel.js').CcTagTextColorModel
  type CcTagTextColorPicker = import('../src/js/popup/ccTagTextColor/CcTagTextColorPicker.js').CcTagTextColorPicker
  type CcTagTextColorPresenter = import('../src/js/popup/ccTagTextColor/CcTagTextColorPresenter.js').CcTagTextColorPresenter
  type CcTagView = import('../src/js/content/view/CcTagView.js').CcTagView
  type CircuitBreaker = import('../src/js/background/CircuitBreaker.js').CircuitBreaker
  type CircuitOpenError = import('../src/js/utils/errors.js').CircuitOpenError
  type ContentContext = import('../src/js/content/ContentContext.js').ContentContext
  type ContentMessageListener = import('../src/js/content/presenter/ContentMessageListener.js').ContentMessageListener
  type IndexedDB = import('../src/js/store/IndexedDB.js').IndexedDB
  type InvalidYouTubeThumnailElementError = import('../src/js/utils/errors.js').InvalidYouTubeThumnailElementError
  type InvalidYouTubeVideoUrlError = import('../src/js/utils/errors.js').InvalidYouTubeVideoUrlError
  type MainDiv = import('../src/js/popup/common/MainDiv.js').MainDiv
  type MessageManager = import('../src/js/utils/MessageManager.js').MessageManager
  type PopupContext = import('../src/js/popup/PopupContext.js').PopupContext
  type ThrottledQueue = import('../src/js/background/ThrottledQueue.js').ThrottledQueue
  type YtMutationHandler = import('../src/js/content/presenter/YtMutationHandler.js').YtMutationHandler
  type YtThumbnailView = import('../src/js/content/view/YtThumbnailView.js').YtThumbnailView
  type YtThumbnailViewManager = import('../src/js/content/presenter/YtThumbnailViewManager.js').YtThumbnailViewManager
}

export {}
