import { getYTVideoId } from '../../utils/common.js'
import { getRelatedLangCodes } from '../../utils/lang.js'

/**
 * @typedef {Object} CcTagModel
 * @property {(backgroundColor: string) => void} setBackgroundColor
 * @property {(textColor: string) => void} setTextColor
 * @property {(fontSize: string) => void} setFontSize
 * @property {(language: string) => void} setLanguage
 * @property {(isCombinedRegion: boolean) => void} setIsCombinedRegion
 * @property {function} backgroundColor
 * @property {function} textColor
 * @property {function} fontSize
 * @property {() => string} shownLanguage
 * @property {() => string[]} relatedLanguages
 * @property {(videoUrl: string, languages: string[]) => Promise<void>} hasCaptions
 */

/**
 * CC Tag Model
 * @param {string} __backgroundColor
 * @param {string} __textColor
 * @param {string} __fontSize
 * @param {string} __language
 * @param {boolean} __isCombinedRegion
 * @returns {CcTagModel}
 */
export const CcTagModel = (
  __backgroundColor,
  __textColor,
  __fontSize,
  __language,
  __isCombinedRegion,
) => {
  let _backgroundColor = __backgroundColor
  let _textColor = __textColor
  let _fontSize = __fontSize
  let _language = __language
  let _isCombinedRegion = __isCombinedRegion

  const setBackgroundColor = backgroundColor =>
    (_backgroundColor = backgroundColor)
  const setTextColor = textColor => (_textColor = textColor)
  const setFontSize = fontSize => (_fontSize = fontSize)
  const setLanguage = language => (_language = language)
  const setIsCombinedRegion = isCombinedRegion =>
    (_isCombinedRegion = isCombinedRegion)

  const backgroundColor = () => _backgroundColor
  const textColor = () => _textColor
  const fontSize = () => _fontSize
  const relatedLanguages = () => {
    if (_isCombinedRegion) {
      return getRelatedLangCodes(_language)
    } else {
      return [_language]
    }
  }
  const shownLanguage = () => {
    if (_isCombinedRegion) {
      return _language.split('-')[0]
    } else {
      return _language
    }
  }

  /**
   * check
   * @param {string} videoUrl
   * @param {string[]} languages
   */
  const hasCaptions = async (videoUrl, languages) => {
    // URL example : /watch?v=[video_id]
    const videoId = getYTVideoId(videoUrl)

    return chrome.runtime.sendMessage({
      type: 'has-captions',
      value: { videoId, languages },
    })
  }

  return {
    setBackgroundColor,
    setTextColor,
    setFontSize,
    setLanguage,
    setIsCombinedRegion,

    backgroundColor,
    textColor,
    fontSize,
    shownLanguage,
    relatedLanguages,

    hasCaptions,
  }
}
