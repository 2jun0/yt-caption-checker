import { localize } from '../utils/common.js'
import { CC_PREVIEW_FONT_SIZE_FIELD, COLOR_BG_FIELD, COLOR_TXT_FIELD, IS_COMBINED_REGION_FIELD, LANGUAGE_FIELD } from '../utils/storage.js'
import { PopupContext } from './popupContext.js'

localize()

const popupContext = PopupContext(document, window.iro)
popupContext.init()
const storage = popupContext.storage()
const languagePresenter = popupContext.languagePresenter()
const ccPreviewBackgroundColorPresenter = popupContext.ccPreviewBackgroundColorPresenter()
const colorTxtPresenter = popupContext.colorTxtPresenter()
const ccPreviewFontSizePresenter = popupContext.ccPreviewFontSizePresenter()

storage.loadData(
  [
    LANGUAGE_FIELD,
    COLOR_BG_FIELD,
    COLOR_TXT_FIELD,
    CC_PREVIEW_FONT_SIZE_FIELD,
    IS_COMBINED_REGION_FIELD,
  ],
  items => {
    languagePresenter.setLanguage(items[LANGUAGE_FIELD])
    languagePresenter.setCombineRegion(items[IS_COMBINED_REGION_FIELD])
    ccPreviewBackgroundColorPresenter.setBackgroundColor(items[COLOR_BG_FIELD])
    colorTxtPresenter.setTextColor(items[COLOR_TXT_FIELD])
    ccPreviewFontSizePresenter.setFontSize(items[CC_PREVIEW_FONT_SIZE_FIELD])
  },
)

