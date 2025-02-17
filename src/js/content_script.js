import { ContentContext } from './content/ContentContext.js'
import {
  COLOR_BG_FIELD,
  COLOR_TXT_FIELD,
  CC_PREVIEW_FONT_SIZE_FIELD,
  IS_COMBINED_REGION_FIELD,
  LANGUAGE_FIELD,
  IS_FILTERING_VIDEOS_FIELD,
} from './store/contants.js'
import { Storage } from './store/Storage.js'

const contentContext = new ContentContext(document)
const ccTagPresenter = contentContext.ccTagPresenter()
contentContext.init()

// option update handlers
const storage = new Storage(chrome.storage.local)

// Load data
storage.loadData(
  [
    LANGUAGE_FIELD,
    COLOR_BG_FIELD,
    COLOR_TXT_FIELD,
    CC_PREVIEW_FONT_SIZE_FIELD,
    IS_COMBINED_REGION_FIELD,
    IS_FILTERING_VIDEOS_FIELD,
  ],
  async items => {
    ccTagPresenter.onBackgroundColorUpdated(items[COLOR_BG_FIELD])
    ccTagPresenter.onTextColorUpdated(items[COLOR_TXT_FIELD])
    ccTagPresenter.onFontSizeUpdated(items[CC_PREVIEW_FONT_SIZE_FIELD])
    await ccTagPresenter.onLanguageUpdated(items[LANGUAGE_FIELD])
    await ccTagPresenter.onIsCombinedRegionUpdated(
      items[IS_COMBINED_REGION_FIELD],
    )
    await ccTagPresenter.onIsFilteringVideosUpdated(
      items[IS_FILTERING_VIDEOS_FIELD],
    )
  },
)
