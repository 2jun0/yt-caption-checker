import { CC_TAG_ID, CcTagView } from '../view/CcTagView.js'

export class CcTagFinder {
  /**
   * @param {Document} document
   */
  constructor(document) {
    this.document = document
  }

  /**
   * Find all CC Tag Views
   * @returns {CcTagView[]}
   */
  findAllCcTagViews() {
    return this.findAllCcTags().map(ccTagDiv => {
      const ccTagSpan = ccTagDiv.firstChild
      return CcTagView(ccTagDiv, ccTagSpan)
    })
  }

  /**
   * Find all CC Tag elements
   * @returns {HTMLElement[]}
   */
  findAllCcTags() {
    return Array.from(this.document.querySelectorAll(`#${CC_TAG_ID}`))
  }
}
