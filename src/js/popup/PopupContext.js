import { CcTagPreview } from "./common/CcTagPreview.js"
import { MainDiv } from "./common/MainDiv.js"

import { CcPreviewFontSizePicker } from "./common/CcPreviewFontSizePicker.js"
import { CcPreviewFontSizePresenter } from "./common/CcPreviewFontSizePresenter.js"
import { CcPreviewFontSizeModel } from "./common/CcPreviewFontSizeModel.js"

import { CombineRegionCheckBox } from "./langauge/CombineRegionCheckBox.js"
import { LanguagePicker } from "./langauge/LanguagePicker.js"
import { LanguagePresenter } from "./langauge/LanguagePresenter.js"
import { LanguageModel } from "./langauge/LanguageModel.js"

// import { CcPreviewBackgroundColorDisplay } from "./backgroundColor/CcPreviewBackgroundColorDisplay.js"
// import { CcPreviewBackgroundColorPicker } from "./backgroundColor/CcPreviewBackgroundColorPicker.js"
// import { CcPreviewBackgroundColorModel } from "./backgroundColor/CcPreviewBackgroundColorModel.js"

import { CcPreviewBackgroundColorPresenter } from "./CcPreviewBackgroundColor/CcPreviewBackgroundColorPresenter.js"
import { CcPreviewBackgroundColorDisplay } from "./CcPreviewBackgroundColor/CcPreviewBackgroundColorDisplay.js"
import { CcPreviewBackgroundColorPicker } from "./CcPreviewBackgroundColor/CcPreviewBackgroundColorPicker.js"
import { CcPreviewBackgroundColorModel } from "./CcPreviewBackgroundColor/CcPreviewBackgroundColorModel.js"

import { CcPreviewTextColorPresenter } from "./textColor/CcPreviewTextColorPresenter.js"
import { CcPreviewTextColorDisplay } from "./textColor/CcPreviewTextColorDisplay.js"
import { CcPreviewTextColorPicker } from "./textColor/CcPreviewTextColorPicker.js"
import { CcPreviewTextColorModel } from "./textColor/CcPreviewTextColorModel.js"
import { MessageManager } from "../utils/MessageManager.js"
import { Storage } from "../utils/storage.js"
import { langs } from "../utils/lang.js"

/**
 * @typedef {Object} PopupContext
 * @property {function} init
 * @property {() => Storage} stoarge
 * @property {() => LanguagePresenter} languagePresenter
 * @property {() => CcPreviewBackgroundColorPresenter} ccPreviewBackgroundColorPresenter
 * @property {() => CcPreviewTextColorPresenter} ccPreviewTextColorPresenter
 * @property {() => CcPreviewFontSizePresenter} ccPreviewFontSizePresenter
 */

/**
 * Popup Object Factory
 * @param {Document} document 
 * @param {*} iro 
 */
export const PopupContext = (document, iro) => {
  /** common */
  /** @type {CcTagPreview} */
  let _ccTagPreview = null
  /** @type {MainDiv} */
  let _mainDiv = null
  
  /** cc preview font size */
  /** @type {CcPreviewFontSizePicker} */
  let _ccPreviewFontSizePicker = null
  /** @type {CcPreviewFontSizePresenter} */
  let _ccPreviewFontSizePresenter = null
  /** @type {CcPreviewFontSizeModel} */
  let _ccPreviewFontSizeModel = null

  /** cc preview language */
  /** @type {CombineRegionCheckBox} */
  let _combineRegionCheckBox = null
  /** @type {LanguagePicker} */
  let _languagePicker = null
  /** @type {LanguagePresenter} */
  let _languagePresenter = null
  /** @type {LanguageModel} */
  let _languageModel = null

  /** cc preview background color */
  /** @type {CcPreviewBackgroundColorDisplay} */
  let _ccPreviewBackgroundColorDisplay = null
  /** @type {CcPreviewBackgroundColorPicker} */
  let _ccPreviewBackgroundColorPicker = null
  /** @type {CcPreviewBackgroundColorPresenter} */
  let _ccPreviewBackgroundColorPresenter = null
  /** @type {CcPreviewBackgroundColorModel} */
  let _ccPreviewBackgroundColorModel = null

  /** cc preview text color */
  /** @type {CcPreviewTextColorDisplay} */
  let _ccPreviewTextColorDisplay = null
  /** @type {CcPreviewTextColorPicker} */
  let _ccPreviewTextColorPicker = null
  /** @type {CcPreviewTextColorPresenter} */
  let _ccPreviewTextColorPresenter = null
  /** @type {CcPreviewTextColorModel} */
  let _ccPreviewTextColorModel = null

  /** @type {Storage} */
  let _storage = null
  /** @type {MessageManager} */
  let _messageManager = null

  const init = () => {
    storage()
    messageManager()

    ccTagPreview()
    mainDiv()
    ccPreviewFontSizePresenter()
    ccPreviewFontSizePicker()
    ccPreviewFontSizeModel()
    ccPreviewBackgroundColorPresenter()
    ccPreviewBackgroundColorDisplay()
    ccPreviewBackgroundColorPicker()
    ccPreviewBackgroundColorModel()
    ccPreviewTextColorPresenter()
    ccPreviewTextColorDisplay()
    ccPreviewTextColorPicker()
    ccPreviewTextColorModel()
    languagePresenter()
    combineRegionCheckBox()
    languagePicker()
    languageModel()
  }

  /** common */
  const ccTagPreview = () => {
    if (!_ccTagPreview) {
      _ccTagPreview = CcTagPreview(document)
    }
    
    return _ccTagPreview
  }

  const mainDiv = () => {
    if (!_mainDiv) {
      _mainDiv = MainDiv(document)
      _mainDiv.init(ccPreviewBackgroundColorPresenter(), ccPreviewTextColorPresenter())
    }

    return _mainDiv
  }

  /** cc preview font size */
  const ccPreviewFontSizePresenter = () => {
    if (!_ccPreviewFontSizePresenter) {
      _ccPreviewFontSizePresenter = CcPreviewFontSizePresenter()
      _ccPreviewFontSizePresenter.init(ccPreviewFontSizePicker(), ccTagPreview(), ccPreviewFontSizeModel())
    }

    return _ccPreviewFontSizePresenter
  }

  const ccPreviewFontSizePicker = () => {
    if (!_ccPreviewFontSizePicker) {
      _ccPreviewFontSizePicker = CcPreviewFontSizePicker(document)
      _ccPreviewFontSizePicker.init(ccPreviewFontSizePresenter())
    }

    return _ccPreviewFontSizePicker
  }

  const ccPreviewFontSizeModel = () => {
    if (!_ccPreviewFontSizeModel) {
      _ccPreviewFontSizeModel = CcPreviewFontSizeModel()
      _ccPreviewFontSizeModel.init(storage(), messageManager())
    }

    return _ccPreviewFontSizeModel
  }

  /** cc preview language */
  const languagePresenter = () => {
    if (!_languagePresenter) {
      _languagePresenter = LanguagePresenter()
      _languagePresenter.init(languagePicker(), combineRegionCheckBox(), ccTagPreview(), languageModel())
    }

    return _languagePresenter
  }

  const combineRegionCheckBox = () => {
    if (!_combineRegionCheckBox) {
      _combineRegionCheckBox = CombineRegionCheckBox(document)
      _combineRegionCheckBox.init(languagePresenter())
    }

    return _combineRegionCheckBox
  }

  const languagePicker = () => {
    if (!_languagePicker) {
      _languagePicker = LanguagePicker(document)
      _languagePicker.init(languagePresenter(), langs)
    }

    return _languagePicker
  }

  const languageModel = () => {
    if (!_languageModel) {
      _languageModel = LanguageModel()
      _languageModel.init(storage(), messageManager())
    }

    return _languageModel
  }

  /** cc preview background color */
  const ccPreviewBackgroundColorPresenter = () => {
    if (!_ccPreviewBackgroundColorPresenter) {
      _ccPreviewBackgroundColorPresenter = CcPreviewBackgroundColorPresenter()
      _ccPreviewBackgroundColorPresenter.init(ccPreviewBackgroundColorPicker(), ccPreviewBackgroundColorDisplay(), ccTagPreview(), ccPreviewBackgroundColorModel())
    }

    return _ccPreviewBackgroundColorPresenter
  }

  const ccPreviewBackgroundColorDisplay = () => {
    if (!_ccPreviewBackgroundColorDisplay) {
      _ccPreviewBackgroundColorDisplay = CcPreviewBackgroundColorDisplay(document)
      _ccPreviewBackgroundColorDisplay.init(ccPreviewBackgroundColorPresenter())
    }
    
    return _ccPreviewBackgroundColorDisplay
  }

  const ccPreviewBackgroundColorPicker = () => {
    if (!_ccPreviewBackgroundColorPicker) {
      _ccPreviewBackgroundColorPicker = CcPreviewBackgroundColorPicker(iro)
      _ccPreviewBackgroundColorPicker.init(ccPreviewBackgroundColorPresenter())
    }

    return _ccPreviewBackgroundColorPicker
  }

  const ccPreviewBackgroundColorModel = () => {
    if (!_ccPreviewBackgroundColorModel) {
      _ccPreviewBackgroundColorModel = CcPreviewBackgroundColorModel()
      _ccPreviewBackgroundColorModel.init(storage(), messageManager())
    }

    return _ccPreviewBackgroundColorModel
  }

  /** cc preview text color */
  const ccPreviewTextColorPresenter = () => {
    if (!_ccPreviewTextColorPresenter) {
      _ccPreviewTextColorPresenter = CcPreviewTextColorPresenter()
      _ccPreviewTextColorPresenter.init(ccPreviewTextColorPicker(), ccPreviewTextColorDisplay(), ccTagPreview(), ccPreviewTextColorModel())
    }

    return _ccPreviewTextColorPresenter
  }

  const ccPreviewTextColorDisplay = () => {
    if (!_ccPreviewTextColorDisplay) {
      _ccPreviewTextColorDisplay = CcPreviewTextColorDisplay(document)
      _ccPreviewTextColorDisplay.init(ccPreviewTextColorPresenter())
    }
    
    return _ccPreviewTextColorDisplay
  }

  const ccPreviewTextColorPicker = () => {
    if (!_ccPreviewTextColorPicker) {
      _ccPreviewTextColorPicker = CcPreviewTextColorPicker(iro)
      _ccPreviewTextColorPicker.init(ccPreviewTextColorPresenter())
    }

    return _ccPreviewTextColorPicker
  }

  const ccPreviewTextColorModel = () => {
    if (!_ccPreviewTextColorModel) {
      _ccPreviewTextColorModel = CcPreviewTextColorModel()
      _ccPreviewTextColorModel.init(storage(), messageManager())
    }

    return _ccPreviewTextColorModel
  }

  const storage = () => {
    if (!_storage) {
      _storage = Storage(chrome.storage.local)
    }

    return _storage
  }

  const messageManager = () => {
    if (!_messageManager) {
      _messageManager = MessageManager()
    }

    return _messageManager
  }

  return {
    init,
    storage,
    languagePresenter,
    ccPreviewBackgroundColorPresenter,
    ccPreviewTextColorPresenter,
    ccPreviewFontSizePresenter
  }
}