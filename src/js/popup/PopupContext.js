import { CcTagPreview } from './common/CcTagPreview.js'
import { MainDiv } from './common/MainDiv.js'

import { CcTagFontSizePicker } from './common/CcTagFontSizePicker.js'
import { CcTagFontSizePresenter } from './common/CcTagFontSizePresenter.js'
import { CcTagFontSizeModel } from './common/CcTagFontSizeModel.js'

import { CcTagCombineRegionCheckBox } from './ccTagLanguage/CcTagCombineRegionCheckBox.js'
import { CcTagLanguagePicker } from './ccTagLanguage/CcTagLanguagePicker.js'
import { CcTagLanguagePresenter } from './ccTagLanguage/CcTagLanguagePresenter.js'
import { CcTagLanguageModel } from './ccTagLanguage/CcTagLanguageModel.js'

import { CcTagBackgroundColorPresenter } from './ccTagBackgroundColor/CcTagBackgroundColorPresenter.js'
import { CcTagBackgroundColorDisplay } from './ccTagBackgroundColor/CcTagBackgroundColorDisplay.js'
import { CcTagBackgroundColorPicker } from './ccTagBackgroundColor/CcTagBackgroundColorPicker.js'
import { CcTagBackgroundColorModel } from './ccTagBackgroundColor/CcTagBackgroundColorModel.js'

import { CcTagTextColorPresenter } from './ccTagTextColor/CcTagTextColorPresenter.js'
import { CcTagTextColorDisplay } from './ccTagTextColor/CcTagTextColorDisplay.js'
import { CcTagTextColorPicker } from './ccTagTextColor/CcTagTextColorPicker.js'
import { CcTagTextColorModel } from './ccTagTextColor/CcTagTextColorModel.js'

import { MessageManager } from '../utils/MessageManager.js'
import { Storage } from '../store/Storage.js'
import { langs } from '../utils/lang.js'

export class PopupContext {
  /** common */
  _ccTagPreview = null
  _mainDiv = null

  /** cc tag font size */
  _ccTagFontSizePicker = null
  _ccTagFontSizePresenter = null
  _ccTagFontSizeModel = null

  /** cc tag language */
  _ccTagCombineRegionCheckBox = null
  _ccTagLanguagePicker = null
  _ccTagLanguagePresenter = null
  _ccTagLanguageModel = null

  /** cc tag background color */
  _ccTagBackgroundColorDisplay = null
  _ccTagBackgroundColorPicker = null
  _ccTagBackgroundColorPresenter = null
  _ccTagBackgroundColorModel = null

  /** cc tag text color */
  _ccTagTextColorDisplay = null
  _ccTagTextColorPicker = null
  _ccTagTextColorPresenter = null
  _ccTagTextColorModel = null

  _storage = null
  _messageManager = null

  constructor(document, iro) {
    this.document = document
    this.iro = iro
  }

  init() {
    this.storage()
    this.messageManager()

    this.ccTagPreview()
    this.mainDiv()
    this.ccTagFontSizePresenter()
    this.ccTagFontSizePicker()
    this.ccTagFontSizeModel()
    this.ccTagBackgroundColorPresenter()
    this.ccTagBackgroundColorDisplay()
    this.ccTagBackgroundColorPicker()
    this.ccTagBackgroundColorModel()
    this.ccTagTextColorPresenter()
    this.ccTagTextColorDisplay()
    this.ccTagTextColorPicker()
    this.ccTagTextColorModel()
    this.ccTagLanguagePresenter()
    this.ccTagCombineRegionCheckBox()
    this.ccTagLanguagePicker()
    this.ccTagLanguageModel()
  }

  /** common */
  ccTagPreview() {
    if (!this._ccTagPreview) {
      this._ccTagPreview = new CcTagPreview(this.document)
    }

    return this._ccTagPreview
  }

  mainDiv() {
    if (!this._mainDiv) {
      this._mainDiv = new MainDiv(this.document)
      this._mainDiv.init(
        this.ccTagBackgroundColorPresenter(),
        this.ccTagTextColorPresenter(),
      )
    }

    return this._mainDiv
  }

  /** cc tag font size */
  ccTagFontSizePresenter() {
    if (!this._ccTagFontSizePresenter) {
      this._ccTagFontSizePresenter = new CcTagFontSizePresenter()
      this._ccTagFontSizePresenter.init(
        this.ccTagFontSizePicker(),
        this.ccTagPreview(),
        this.ccTagFontSizeModel(),
      )
    }

    return this._ccTagFontSizePresenter
  }

  ccTagFontSizePicker() {
    if (!this._ccTagFontSizePicker) {
      this._ccTagFontSizePicker = new CcTagFontSizePicker(this.document)
      this._ccTagFontSizePicker.init(this.ccTagFontSizePresenter())
    }

    return this._ccTagFontSizePicker
  }

  ccTagFontSizeModel() {
    if (!this._ccTagFontSizeModel) {
      this._ccTagFontSizeModel = new CcTagFontSizeModel()
      this._ccTagFontSizeModel.init(this.storage(), this.messageManager())
    }

    return this._ccTagFontSizeModel
  }

  /** cc tag language */
  ccTagLanguagePresenter() {
    if (!this._ccTagLanguagePresenter) {
      this._ccTagLanguagePresenter = new CcTagLanguagePresenter()
      this._ccTagLanguagePresenter.init(
        this.ccTagLanguagePicker(),
        this.ccTagCombineRegionCheckBox(),
        this.ccTagPreview(),
        this.ccTagLanguageModel(),
      )
    }

    return this._ccTagLanguagePresenter
  }

  ccTagCombineRegionCheckBox() {
    if (!this._ccTagCombineRegionCheckBox) {
      this._ccTagCombineRegionCheckBox = new CcTagCombineRegionCheckBox(
        this.document,
      )
      this._ccTagCombineRegionCheckBox.init(this.ccTagLanguagePresenter())
    }

    return this._ccTagCombineRegionCheckBox
  }

  ccTagLanguagePicker() {
    if (!this._ccTagLanguagePicker) {
      this._ccTagLanguagePicker = new CcTagLanguagePicker(this.document)
      this._ccTagLanguagePicker.init(this.ccTagLanguagePresenter(), langs)
    }

    return this._ccTagLanguagePicker
  }

  ccTagLanguageModel() {
    if (!this._ccTagLanguageModel) {
      this._ccTagLanguageModel = new CcTagLanguageModel()
      this._ccTagLanguageModel.init(this.storage(), this.messageManager())
    }

    return this._ccTagLanguageModel
  }

  /** cc tag background color */
  ccTagBackgroundColorPresenter() {
    if (!this._ccTagBackgroundColorPresenter) {
      this._ccTagBackgroundColorPresenter = new CcTagBackgroundColorPresenter()
      this._ccTagBackgroundColorPresenter.init(
        this.ccTagBackgroundColorPicker(),
        this.ccTagBackgroundColorDisplay(),
        this.ccTagPreview(),
        this.ccTagBackgroundColorModel(),
      )
    }

    return this._ccTagBackgroundColorPresenter
  }

  ccTagBackgroundColorDisplay() {
    if (!this._ccTagBackgroundColorDisplay) {
      this._ccTagBackgroundColorDisplay = new CcTagBackgroundColorDisplay(
        this.document,
      )
      this._ccTagBackgroundColorDisplay.init(
        this.ccTagBackgroundColorPresenter(),
      )
    }

    return this._ccTagBackgroundColorDisplay
  }

  ccTagBackgroundColorPicker() {
    if (!this._ccTagBackgroundColorPicker) {
      this._ccTagBackgroundColorPicker = new CcTagBackgroundColorPicker(
        this.iro,
      )
      this._ccTagBackgroundColorPicker.init(
        this.ccTagBackgroundColorPresenter(),
      )
    }

    return this._ccTagBackgroundColorPicker
  }

  ccTagBackgroundColorModel() {
    if (!this._ccTagBackgroundColorModel) {
      this._ccTagBackgroundColorModel = new CcTagBackgroundColorModel()
      this._ccTagBackgroundColorModel.init(
        this.storage(),
        this.messageManager(),
      )
    }

    return this._ccTagBackgroundColorModel
  }

  /** cc tag text color */
  ccTagTextColorPresenter() {
    if (!this._ccTagTextColorPresenter) {
      this._ccTagTextColorPresenter = new CcTagTextColorPresenter()
      this._ccTagTextColorPresenter.init(
        this.ccTagTextColorPicker(),
        this.ccTagTextColorDisplay(),
        this.ccTagPreview(),
        this.ccTagTextColorModel(),
      )
    }

    return this._ccTagTextColorPresenter
  }

  ccTagTextColorDisplay() {
    if (!this._ccTagTextColorDisplay) {
      this._ccTagTextColorDisplay = new CcTagTextColorDisplay(this.document)
      this._ccTagTextColorDisplay.init(this.ccTagTextColorPresenter())
    }

    return this._ccTagTextColorDisplay
  }

  ccTagTextColorPicker() {
    if (!this._ccTagTextColorPicker) {
      this._ccTagTextColorPicker = new CcTagTextColorPicker(this.iro)
      this._ccTagTextColorPicker.init(this.ccTagTextColorPresenter())
    }

    return this._ccTagTextColorPicker
  }

  ccTagTextColorModel() {
    if (!this._ccTagTextColorModel) {
      this._ccTagTextColorModel = new CcTagTextColorModel()
      this._ccTagTextColorModel.init(this.storage(), this.messageManager())
    }

    return this._ccTagTextColorModel
  }

  storage() {
    if (!this._storage) {
      this._storage = new Storage(chrome.storage.local)
    }

    return this._storage
  }

  messageManager() {
    if (!this._messageManager) {
      this._messageManager = new MessageManager()
    }

    return this._messageManager
  }
}
