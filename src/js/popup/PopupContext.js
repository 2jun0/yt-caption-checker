import { CcTagPreview } from "./common/CcTagPreview.js"
import { MainDiv } from "./common/MainDiv.js"

import { CcTagFontSizePicker } from "./common/CcTagFontSizePicker.js"
import { CcTagFontSizePresenter } from "./common/CcTagFontSizePresenter.js"
import { CcTagFontSizeModel } from "./common/CcTagFontSizeModel.js"

import { CcTagCombineRegionCheckBox } from "./ccTagLangauge/CcTagCombineRegionCheckBox.js"
import { CcTagLanguagePicker } from "./ccTagLangauge/CcTagLanguagePicker.js"
import { CcTagLanguagePresenter } from "./ccTagLangauge/CcTagLanguagePresenter.js"
import { CcTagLanguageModel } from "./ccTagLangauge/CcTagLanguageModel.js"

import { CcTagBackgroundColorPresenter } from "./ccTagBackgroundColor/CcTagBackgroundColorPresenter.js"
import { CcTagBackgroundColorDisplay } from "./ccTagBackgroundColor/CcTagBackgroundColorDisplay.js"
import { CcTagBackgroundColorPicker } from "./ccTagBackgroundColor/CcTagBackgroundColorPicker.js"
import { CcTagBackgroundColorModel } from "./ccTagBackgroundColor/CcTagBackgroundColorModel.js"

import { CcTagTextColorPresenter } from "./ccTagTextColor/CcTagTextColorPresenter.js"
import { CcTagTextColorDisplay } from "./ccTagTextColor/CcTagTextColorDisplay.js"
import { CcTagTextColorPicker } from "./ccTagTextColor/CcTagTextColorPicker.js"
import { CcTagTextColorModel } from "./ccTagTextColor/CcTagTextColorModel.js"

import { MessageManager } from "../utils/MessageManager.js"
import { Storage } from "../utils/storage.js"
import { langs } from "../utils/lang.js"

/**
 * @typedef {Object} PopupContext
 * @property {function} init
 * @property {() => Storage} stoarge
 * @property {() => CcTagLanguagePresenter} ccTagLanguagePresenter
 * @property {() => CcTagBackgroundColorPresenter} ccTagBackgroundColorPresenter
 * @property {() => CcTagTextColorPresenter} ccTagTextColorPresenter
 * @property {() => CcTagFontSizePresenter} ccTagFontSizePresenter
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
  
  /** cc tag font size */
  /** @type {CcTagFontSizePicker} */
  let _ccTagFontSizePicker = null
  /** @type {CcTagFontSizePresenter} */
  let _ccTagFontSizePresenter = null
  /** @type {CcTagFontSizeModel} */
  let _ccTagFontSizeModel = null

  /** cc tag language */
  /** @type {CcTagCombineRegionCheckBox} */
  let _ccTagCombineRegionCheckBox = null
  /** @type {CcTagLanguagePicker} */
  let _ccTagLanguagePicker = null
  /** @type {CcTagLanguagePresenter} */
  let _ccTagLanguagePresenter = null
  /** @type {CcTagLanguageModel} */
  let _ccTagLanguageModel = null

  /** cc tag background color */
  /** @type {CcTagBackgroundColorDisplay} */
  let _ccTagBackgroundColorDisplay = null
  /** @type {CcTagBackgroundColorPicker} */
  let _ccTagBackgroundColorPicker = null
  /** @type {CcTagBackgroundColorPresenter} */
  let _ccTagBackgroundColorPresenter = null
  /** @type {CcTagBackgroundColorModel} */
  let _ccTagBackgroundColorModel = null

  /** cc tag text color */
  /** @type {CcTagTextColorDisplay} */
  let _ccTagTextColorDisplay = null
  /** @type {CcTagTextColorPicker} */
  let _ccTagTextColorPicker = null
  /** @type {CcTagTextColorPresenter} */
  let _ccTagTextColorPresenter = null
  /** @type {CcTagTextColorModel} */
  let _ccTagTextColorModel = null

  /** @type {Storage} */
  let _storage = null
  /** @type {MessageManager} */
  let _messageManager = null

  const init = () => {
    storage()
    messageManager()

    ccTagPreview()
    mainDiv()
    ccTagFontSizePresenter()
    ccTagFontSizePicker()
    ccTagFontSizeModel()
    ccTagBackgroundColorPresenter()
    ccTagBackgroundColorDisplay()
    ccTagBackgroundColorPicker()
    ccTagBackgroundColorModel()
    ccTagTextColorPresenter()
    ccTagTextColorDisplay()
    ccTagTextColorPicker()
    ccTagTextColorModel()
    ccTagLanguagePresenter()
    ccTagCombineRegionCheckBox()
    ccTagLanguagePicker()
    ccTagLanguageModel()
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
      _mainDiv.init(ccTagBackgroundColorPresenter(), ccTagTextColorPresenter())
    }

    return _mainDiv
  }

  /** cc tag font size */
  const ccTagFontSizePresenter = () => {
    if (!_ccTagFontSizePresenter) {
      _ccTagFontSizePresenter = CcTagFontSizePresenter()
      _ccTagFontSizePresenter.init(ccTagFontSizePicker(), ccTagPreview(), ccTagFontSizeModel())
    }

    return _ccTagFontSizePresenter
  }

  const ccTagFontSizePicker = () => {
    if (!_ccTagFontSizePicker) {
      _ccTagFontSizePicker = CcTagFontSizePicker(document)
      _ccTagFontSizePicker.init(ccTagFontSizePresenter())
    }

    return _ccTagFontSizePicker
  }

  const ccTagFontSizeModel = () => {
    if (!_ccTagFontSizeModel) {
      _ccTagFontSizeModel = CcTagFontSizeModel()
      _ccTagFontSizeModel.init(storage(), messageManager())
    }

    return _ccTagFontSizeModel
  }

  /** cc tag language */
  const ccTagLanguagePresenter = () => {
    if (!_ccTagLanguagePresenter) {
      _ccTagLanguagePresenter = CcTagLanguagePresenter()
      _ccTagLanguagePresenter.init(ccTagLanguagePicker(), ccTagCombineRegionCheckBox(), ccTagPreview(), ccTagLanguageModel())
    }

    return _ccTagLanguagePresenter
  }

  const ccTagCombineRegionCheckBox = () => {
    if (!_ccTagCombineRegionCheckBox) {
      _ccTagCombineRegionCheckBox = CcTagCombineRegionCheckBox(document)
      _ccTagCombineRegionCheckBox.init(ccTagLanguagePresenter())
    }

    return _ccTagCombineRegionCheckBox
  }

  const ccTagLanguagePicker = () => {
    if (!_ccTagLanguagePicker) {
      _ccTagLanguagePicker = CcTagLanguagePicker(document)
      _ccTagLanguagePicker.init(ccTagLanguagePresenter(), langs)
    }

    return _ccTagLanguagePicker
  }

  const ccTagLanguageModel = () => {
    if (!_ccTagLanguageModel) {
      _ccTagLanguageModel = CcTagLanguageModel()
      _ccTagLanguageModel.init(storage(), messageManager())
    }

    return _ccTagLanguageModel
  }

  /** cc tag background color */
  const ccTagBackgroundColorPresenter = () => {
    if (!_ccTagBackgroundColorPresenter) {
      _ccTagBackgroundColorPresenter = CcTagBackgroundColorPresenter()
      _ccTagBackgroundColorPresenter.init(ccTagBackgroundColorPicker(), ccTagBackgroundColorDisplay(), ccTagPreview(), ccTagBackgroundColorModel())
    }

    return _ccTagBackgroundColorPresenter
  }

  const ccTagBackgroundColorDisplay = () => {
    if (!_ccTagBackgroundColorDisplay) {
      _ccTagBackgroundColorDisplay = CcTagBackgroundColorDisplay(document)
      _ccTagBackgroundColorDisplay.init(ccTagBackgroundColorPresenter())
    }
    
    return _ccTagBackgroundColorDisplay
  }

  const ccTagBackgroundColorPicker = () => {
    if (!_ccTagBackgroundColorPicker) {
      _ccTagBackgroundColorPicker = CcTagBackgroundColorPicker(iro)
      _ccTagBackgroundColorPicker.init(ccTagBackgroundColorPresenter())
    }

    return _ccTagBackgroundColorPicker
  }

  const ccTagBackgroundColorModel = () => {
    if (!_ccTagBackgroundColorModel) {
      _ccTagBackgroundColorModel = CcTagBackgroundColorModel()
      _ccTagBackgroundColorModel.init(storage(), messageManager())
    }

    return _ccTagBackgroundColorModel
  }

  /** cc tag text color */
  const ccTagTextColorPresenter = () => {
    if (!_ccTagTextColorPresenter) {
      _ccTagTextColorPresenter = CcTagTextColorPresenter()
      _ccTagTextColorPresenter.init(ccTagTextColorPicker(), ccTagTextColorDisplay(), ccTagPreview(), ccTagTextColorModel())
    }

    return _ccTagTextColorPresenter
  }

  const ccTagTextColorDisplay = () => {
    if (!_ccTagTextColorDisplay) {
      _ccTagTextColorDisplay = CcTagTextColorDisplay(document)
      _ccTagTextColorDisplay.init(ccTagTextColorPresenter())
    }
    
    return _ccTagTextColorDisplay
  }

  const ccTagTextColorPicker = () => {
    if (!_ccTagTextColorPicker) {
      _ccTagTextColorPicker = CcTagTextColorPicker(iro)
      _ccTagTextColorPicker.init(ccTagTextColorPresenter())
    }

    return _ccTagTextColorPicker
  }

  const ccTagTextColorModel = () => {
    if (!_ccTagTextColorModel) {
      _ccTagTextColorModel = CcTagTextColorModel()
      _ccTagTextColorModel.init(storage(), messageManager())
    }

    return _ccTagTextColorModel
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
    ccTagLanguagePresenter,
    ccTagBackgroundColorPresenter,
    ccTagTextColorPresenter,
    ccTagFontSizePresenter
  }
}