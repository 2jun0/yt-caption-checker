import { localize } from '../utils/common.js'
import {
  CC_PREVIEW_FONT_SIZE_FIELD,
  COLOR_BG_FIELD,
  COLOR_TXT_FIELD,
  IS_COMBINED_REGION_FIELD,
  LANGUAGE_FIELD,
} from '../store/contants.js'
import { PopupContext } from './PopupContext.js'

localize()

const popupContext = new PopupContext(document, window.iro)
popupContext.init()
const storage = popupContext.storage()
const ccTagLanguagePresenter = popupContext.ccTagLanguagePresenter()
const ccTagBackgroundColorPresenter =
  popupContext.ccTagBackgroundColorPresenter()
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
    ccTagLanguagePresenter.setLanguage(items[LANGUAGE_FIELD])
    ccTagLanguagePresenter.setCombineRegion(items[IS_COMBINED_REGION_FIELD])
    ccTagBackgroundColorPresenter.setBackgroundColor(items[COLOR_BG_FIELD])
    ccTagTextColorPresenter.setTextColor(items[COLOR_TXT_FIELD])
    ccTagFontSizePresenter.setFontSize(items[CC_PREVIEW_FONT_SIZE_FIELD])
  },
)
