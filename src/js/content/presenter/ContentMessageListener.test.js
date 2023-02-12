import { CC_PREVIEW_FONT_SIZE_FIELD, COLOR_BG_FIELD, COLOR_TXT_FIELD, IS_COMBINED_REGION_FIELD, LANGUAGE_FIELD } from "../../utils/storage.js";
import { CcTagPresenter } from "./CcTagPresenter.js";
import { ContentMessageListener } from "./ContentMessageListener.js";
import { jest } from '@jest/globals'

describe("ContentMessageListener", () => {
  /** @type {CcTagPresenter} */
  let ccTagPresenter
  /** @type {ContentMessageListener} */
  let contentMessageListener

  beforeEach(() => {
    ccTagPresenter = {
      onBackgroundColorUpdated: jest.fn(),
      onTextColorUpdated: jest.fn(),
      onFontSizeUpdated: jest.fn(),
      onLanguageUpdated: jest.fn(),
      onIsCombinedRegionUpdated: jest.fn()
    }
    contentMessageListener = ContentMessageListener(ccTagPresenter)
  })

  it("should call onLanguageUpdated on ccTagPresenter with the value of LANGUAGE_FIELD", () => {
    const req = { [LANGUAGE_FIELD]: "en" };
    contentMessageListener(req)
    expect(ccTagPresenter.onLanguageUpdated).toHaveBeenCalledWith("en");
  })

  it("should call onBackgroundColorUpdated on ccTagPresenter with the value of COLOR_BG_FIELD", () => {
    const req = { [COLOR_BG_FIELD]: "#00000000" };
    contentMessageListener(req)
    expect(ccTagPresenter.onBackgroundColorUpdated).toHaveBeenCalledWith("#00000000");
  })

  it("should call onTextColorUpdated on ccTagPresenter with the value of COLOR_TXT_FIELD", () => {
    const req = { [COLOR_TXT_FIELD]: "#FFFFFF" };
    contentMessageListener(req)
    expect(ccTagPresenter.onTextColorUpdated).toHaveBeenCalledWith("#FFFFFF");
  })

  it("should call onFontSizeUpdated on ccTagPresenter with the value of CC_PREVIEW_FONT_SIZE_FIELD", () => {
    const req = { [CC_PREVIEW_FONT_SIZE_FIELD]: "1.2rem" };
    contentMessageListener(req)
    expect(ccTagPresenter.onFontSizeUpdated).toHaveBeenCalledWith("1.2rem");
  })

  it("should call onIsCombinedRegionUpdated on ccTagPresenter with the value of IS_COMBINED_REGION_FIELD", () => {
    const req = { [IS_COMBINED_REGION_FIELD]: true };
    contentMessageListener(req)
    expect(ccTagPresenter.onIsCombinedRegionUpdated).toHaveBeenCalledWith(true);
  })
});