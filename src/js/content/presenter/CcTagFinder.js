import { CC_TAG_ID, CcTagView } from '../view/CcTagView.js'

/**
 * @typedef {Object} CcTagFinder
 * @property {() => CcTagView[]} findAllCcTagViews
 */

/**
 * CC Tag Finder
 * @param {Document} document
 * @returns {CcTagFinder}
 */
export const CcTagFinder = document => {
  /**
   * find all CC Tag View
   * @returns {CcTagView[]}
   */
  const findAllCcTagViews = () => {
    return findAllCcTags().map(ccTagDiv => {
      const ccTagSpan = ccTagDiv.firstChild
      return CcTagView(ccTagDiv, ccTagSpan)
    })
  }

  /**
   * find all CC Tag
   * @returns {HTMLElement[]}
   */
  const findAllCcTags = () => {
    return Array.from(document.querySelectorAll(`#${CC_TAG_ID}`))
  }

  return {
    findAllCcTagViews,
  }
}
