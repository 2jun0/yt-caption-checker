import { localize } from '../utils/common.js'
import { CC_PREVIEW_FONT_SIZE_FIELD, COLOR_BG_FIELD, COLOR_TXT_FIELD, IS_COMBINED_REGION_FIELD, LANGUAGE_FIELD } from '../utils/storage.js'
import { PopupContext } from './popupContext.js'

localize()

const popupContext = PopupContext(document, window.iro)
popupContext.init()
const storage = popupContext.storage()
const languagePresenter = popupContext.languagePresenter()
const ccTagBackgroundColorPresenter = popupContext.ccTagBackgroundColorPresenter()
const ccTagTextColorPresenter = popupContext.ccTagTextColorPresenter()
const ccTagFontSizePresenter = popupContext.ccTagFontSizePresenter()

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
    ccTagBackgroundColorPresenter.setBackgroundColor(items[COLOR_BG_FIELD])
    ccTagTextColorPresenter.setTextColor(items[COLOR_TXT_FIELD])
    ccTagFontSizePresenter.setFontSize(items[CC_PREVIEW_FONT_SIZE_FIELD])
  },
)

