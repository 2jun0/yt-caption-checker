export const CC_LOADING_ID = 'cc-loading'

export class CcLoadingView {
  /**
   * @param {HTMLDivElement} loadingDiv
   */
  constructor(loadingDiv) {
    this.loadingDiv = loadingDiv
  }

  remove() {
    this.loadingDiv.remove()
  }

  /**
   * Get the loading element
   * @returns {HTMLDivElement}
   */
  loadingElement() {
    return this.loadingDiv
  }
}
