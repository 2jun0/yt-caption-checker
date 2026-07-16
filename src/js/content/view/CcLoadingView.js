export const CC_LOADING_ID = 'cc-loading'

export class CcLoadingView {
  /**
   * @param {HTMLDivElement} ccLoadingDiv
   */
  constructor(ccLoadingDiv) {
    this.ccLoadingDiv = ccLoadingDiv
  }

  remove() {
    this.ccLoadingDiv.remove()
  }

  /**
   * Get the loading element
   * @returns {HTMLDivElement}
   */
  ccLoadingElement() {
    return this.ccLoadingDiv
  }
}
