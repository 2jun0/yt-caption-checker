import { getYTVideoId } from '../../utils/common.js'
import { getRelatedLangCodes } from '../../utils/lang.js'

export class CcTagModel {
  /**
   * @param {string} backgroundColor
   * @param {string} textColor
   * @param {string} fontSize
   * @param {string} language
   * @param {boolean} isCombinedRegion
   */
  constructor(
    backgroundColor,
    textColor,
    fontSize,
    language,
    isCombinedRegion,
  ) {
    this._backgroundColor = backgroundColor
    this._textColor = textColor
    this._fontSize = fontSize
    this._language = language
    this._isCombinedRegion = isCombinedRegion
  }

  setBackgroundColor(backgroundColor) {
    this._backgroundColor = backgroundColor
  }

  setTextColor(textColor) {
    this._textColor = textColor
  }

  setFontSize(fontSize) {
    this._fontSize = fontSize
  }

  setLanguage(language) {
    this._language = language
  }

  setIsCombinedRegion(isCombinedRegion) {
    this._isCombinedRegion = isCombinedRegion
  }

  get backgroundColor() {
    return this._backgroundColor
  }

  get textColor() {
    return this._textColor
  }

  get fontSize() {
    return this._fontSize
  }

  get shownLanguage() {
    return this._isCombinedRegion
      ? this._language.split('-')[0]
      : this._language
  }

  get relatedLanguages() {
    return this._isCombinedRegion
      ? getRelatedLangCodes(this._language)
      : [this._language]
  }

  get isCombinedRegion() {
    return this._isCombinedRegion
  }

  get language() {
    return this._language
  }

  /**
   * Checks if the video has captions
   * @param {string} videoUrl
   * @param {string[]} languages
   * @returns {Promise<void>}
   */
  async hasCaptions(videoUrl, languages) {
    // URL example : /watch?v=[video_id]
    const videoId = getYTVideoId(videoUrl)
    return chrome.runtime.sendMessage({
      type: 'has-captions',
      value: { videoId, languages },
    })
  }
}
