import { CcStatusExample } from "./common/CcStatusExample"
import { MainDiv } from "./common/MainDiv"

import { CcPreviewFontSizePicker } from "./common/CcPreviewFontSizePicker"
import { CcPreviewFontSizePresenter } from "./common/CcPreviewFontSizePresenter"
import { CcPreviewFontSizeModel } from "./common/CcPreviewFontSizeModel"

import { CombineRegionCheckBox } from "./langauge/CombineRegionCheckBox"
import { LanguagePicker } from "./langauge/LanguagePicker"
import { LanguagePresenter } from "./langauge/LanguagePresenter"
import { LanguageModel } from "./langauge/LanguageModel"

import { ColorBgPresenter } from "./backgroundColor/ColorBgPresenter"
import { ColorBgDisplay } from "./backgroundColor/ColorBgDisplay"
import { ColorBgPicker } from "./backgroundColor/ColorBgPicker"
import { ColorBgModel } from "./backgroundColor/ColorBgModel"

import { ColorTxtPresenter } from "./textColor/ColorTxtPresenter"
import { ColorTxtDisplay } from "./textColor/ColorTxtDisplay"
import { ColorTxtPicker } from "./textColor/ColorTxtPicker"
import { ColorTxtModel } from "./textColor/ColorTxtModel"
import { MessageManager } from "../utils/MessageManager"
import { Storage } from "../utils/storage"

/**
 * @typedef {Object} PopupContext
 * @property {function} init
 * @property {() => Storage} stoarge
 * @property {() => LanguagePresenter} languagePresenter
 * @property {() => ColorBgPresenter} colorBgPresenter
 * @property {() => ColorTxtPresenter} colorTxtPresenter
 * @property {() => CcPreviewFontSizePresenter} ccPreviewFontSizePresenter
 */

/**
 * Popup Object Factory
 * @param {Document} document 
 * @param {*} iro 
 */
export const PopupContext = (document, iro) => {
  /** common */
  /** @type {CcStatusExample} */
  let _ccStatusExample = null
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
  /** @type {ColorBgDisplay} */
  let _colorBgDisplay = null
  /** @type {ColorBgPicker} */
  let _colorBgPicker = null
  /** @type {ColorBgPresenter} */
  let _colorBgPresenter = null
  /** @type {ColorBgModel} */
  let _colorBgModel = null

  /** cc preview text color */
  /** @type {ColorTxtDisplay} */
  let _colorTxtDisplay = null
  /** @type {ColorTxtPicker} */
  let _colorTxtPicker = null
  /** @type {ColorTxtPresenter} */
  let _colorTxtPresenter = null
  /** @type {ColorTxtModel} */
  let _colorTxtModel = null

  /** @type {Storage} */
  let _storage = null
  /** @type {MessageManager} */
  let _messageManager = null

  const init = () => {
    storage()
    messageManager()

    ccStatusExample()
    mainDiv()
    ccPreviewFontSizePresenter()
    ccPreviewFontSizePicker()
    ccPreviewFontSizeModel()
    colorBgPresenter()
    colorBgDisplay()
    colorBgPicker()
    colorBgModel()
    colorTxtPresenter()
    colorTxtDisplay()
    colorTxtPicker()
    colorTxtModel()
    languagePresenter()
    combineRegionCheckBox()
    languagePicker()
    languageModel()
  }

  /** common */
  const ccStatusExample = () => {
    if (!_ccStatusExample) {
      _ccStatusExample = CcStatusExample(document)
    }
    
    return _ccStatusExample
  }

  const mainDiv = () => {
    if (!_mainDiv) {
      _mainDiv = MainDiv(document)
    }

    return _mainDiv
  }

  /** cc preview font size */
  const ccPreviewFontSizePresenter = () => {
    if (!_ccPreviewFontSizePresenter) {
      _ccPreviewFontSizePresenter = CcPreviewFontSizePresenter()
      _ccPreviewFontSizePresenter.init(ccPreviewFontSizePicker(), ccStatusExample(), ccPreviewFontSizeModel())
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
      _ccPreviewFontSizeModel.init(storage())
    }

    return _ccPreviewFontSizeModel
  }

  /** cc preview language */
  const languagePresenter = () => {
    if (!_languagePresenter) {
      _languagePresenter = LanguagePresenter()
      _languagePresenter.init(languagePicker(), combineRegionCheckBox(), ccStatusExample(), languageModel())
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
      _languagePicker.init(languagePresenter())
    }

    return _languagePicker
  }

  const languageModel = () => {
    if (!_languageModel) {
      _languageModel = LanguageModel()
      _languageModel.init(storage())
    }

    return _languageModel
  }

  /** cc preview background color */
  const colorBgPresenter = () => {
    if (!_colorBgPresenter) {
      _colorBgPresenter = ColorBgPresenter()
      _colorBgPresenter.init(colorBgPicker(), colorBgDisplay(), ccStatusExample(), colorBgModel())
    }

    return _colorBgPresenter
  }

  const colorBgDisplay = () => {
    if (!_colorBgDisplay) {
      _colorBgDisplay = ColorBgDisplay(document)
      _colorBgDisplay.init(colorBgPresenter())
    }
    
    return _colorBgDisplay
  }

  const colorBgPicker = () => {
    if (!_colorBgPicker) {
      _colorBgPicker = ColorBgPicker(iro)
      _colorBgPicker.init(colorBgPresenter())
    }

    return _colorBgPicker
  }

  const colorBgModel = () => {
    if (!_colorBgModel) {
      _colorBgModel = ColorBgModel()
      _colorBgModel.init(storage(), messageManager())
    }

    return _colorBgModel
  }

  /** cc preview text color */
  const colorTxtPresenter = () => {
    if (!_colorTxtPresenter) {
      _colorTxtPresenter = ColorTxtPresenter()
      _colorTxtPresenter.init(colorTxtPicker(), colorTxtDisplay(), ccStatusExample(), colorTxtModel())
    }

    return _colorTxtPresenter
  }

  const colorTxtDisplay = () => {
    if (!_colorTxtDisplay) {
      _colorTxtDisplay = ColorTxtDisplay(document)
      _colorTxtDisplay.init(colorTxtPresenter())
    }
    
    return _colorTxtDisplay
  }

  const colorTxtPicker = () => {
    if (!_colorTxtPicker) {
      _colorTxtPicker = ColorTxtPicker(iro)
      _colorTxtPicker.init(colorTxtPresenter())
    }

    return _colorTxtPicker
  }

  const colorTxtModel = () => {
    if (!_colorTxtModel) {
      _colorTxtModel = ColorTxtModel()
      _colorTxtModel.init(storage(), messageManager())
    }

    return _colorTxtModel
  }

  const storage = () => {
    if (!_storage) {
      _storage = Storage(chrome.storage.local)
    }

    return _storage
  }

  const messageManager = () => {
    if (_messageManager) {
      _messageManager = MessageManager()
    }
  }

  return {
    init,
    storage,
    languagePresenter,
    colorBgPresenter,
    colorTxtPresenter,
    ccPreviewFontSizePresenter
  }
}