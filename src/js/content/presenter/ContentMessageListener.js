import { CC_PREVIEW_FONT_SIZE_FIELD, COLOR_BG_FIELD, COLOR_TXT_FIELD, IS_COMBINED_REGION_FIELD, LANGUAGE_FIELD } from "../../utils/storage.js";
import { CcTagPresenter } from "./CcTagPresenter.js";

/**
 * @typedef {Object} ContentMessageListener
 */

/**
 * Content Script Message Listen
 * @example messageManager.addOnMessageListener(ContentMessageListener(ccTagPresenter))
 * @param {CcTagPresenter} ccTagPresenter 
 * @returns {ContentMessageListener}
 */
export const ContentMessageListener = ccTagPresenter => {
  return req => {
    if (LANGUAGE_FIELD in req) ccTagPresenter.onLanguageUpdated(req[LANGUAGE_FIELD])
    if (COLOR_BG_FIELD in req) ccTagPresenter.onBackgroundColorUpdated(req[COLOR_BG_FIELD])
    if (COLOR_TXT_FIELD in req) ccTagPresenter.onTextColorUpdated(req[COLOR_TXT_FIELD])
    if (CC_PREVIEW_FONT_SIZE_FIELD in req) ccTagPresenter.onFontSizeUpdated(req[CC_PREVIEW_FONT_SIZE_FIELD])
    if (IS_COMBINED_REGION_FIELD in req) ccTagPresenter.onIsCombinedRegionUpdated(req[IS_COMBINED_REGION_FIELD])
  }
}