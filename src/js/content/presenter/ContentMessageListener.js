import {
  CC_PREVIEW_FONT_SIZE_FIELD,
  COLOR_BG_FIELD,
  COLOR_TXT_FIELD,
  IS_COMBINED_REGION_FIELD,
  IS_FILTERING_VIDEOS_FIELD,
  LANGUAGE_FIELD,
} from '../../store/contants.js'
import { CcTagPresenter } from './CcTagPresenter.js'

export class ContentMessageListener {
  /**
   * @param {CcTagPresenter} ccTagPresenter
   */
  constructor(ccTagPresenter) {
    this.ccTagPresenter = ccTagPresenter
  }

  /**
   * Message listener for content script
   * @param {Object} req - The incoming message request
   */
  handleMessage(req) {
    if (LANGUAGE_FIELD in req) {
      this.ccTagPresenter.onLanguageUpdated(req[LANGUAGE_FIELD])
    }
    if (COLOR_BG_FIELD in req) {
      this.ccTagPresenter.onBackgroundColorUpdated(req[COLOR_BG_FIELD])
    }
    if (COLOR_TXT_FIELD in req) {
      this.ccTagPresenter.onTextColorUpdated(req[COLOR_TXT_FIELD])
    }
    if (CC_PREVIEW_FONT_SIZE_FIELD in req) {
      this.ccTagPresenter.onFontSizeUpdated(req[CC_PREVIEW_FONT_SIZE_FIELD])
    }
    if (IS_COMBINED_REGION_FIELD in req) {
      this.ccTagPresenter.onIsCombinedRegionUpdated(
        req[IS_COMBINED_REGION_FIELD],
      )
    }
    if (IS_FILTERING_VIDEOS_FIELD in req) {
      this.ccTagPresenter.onIsFilteringVideosUpdated(
        req[IS_FILTERING_VIDEOS_FIELD],
      )
    }
  }
}
