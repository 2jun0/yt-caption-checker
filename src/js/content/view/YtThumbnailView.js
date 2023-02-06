import { CC_TAG_ID, CcTagView } from "./CcTagView.js"

/**
 * @typedef {Object} YtThumbnailView
 * @property {(ccTagView: CcTagView) => Promise<void>} insertCcTag
 * @property {() => Promise<boolean>} hasCcTag
 * @property {() => string} getVideoUrl
 */

/**
 * YouTube Thumbnail View
 * @param {HTMLElement} thumbnailEl
 * @returns {YtThumbnailView}
 */
export const YtThumbnailView = thumbnailEl => {
  let _overlays = null

  /**
   * insert cc tag in YouTube thumbnail
   * @param {CcTagView} ccTagView 
   */
  const insertCcTag = async ccTagView => {
    const overlays = await getOverlays()
    // time out
    if (!overlays || await hasCcTag()) return

    overlays.insertBefore(ccTagView.ccTagElement(), overlays.lastChild)
  }

  const hasCcTag = async () => {
    const overlays = await getOverlays()
    // time out
    if (!overlays) return false

    return !!overlays.querySelector(`#${CC_TAG_ID}`)
  }

  const getVideoUrl = () => {
    return thumbnailEl.href
  }

  /**
   * get overlays
   * @returns {Promise<HTMLElement>}
   */
  const getOverlays = async () => {
    if (!_overlays) {
      _overlays = await waitOverlayLoadedAsnyc(thumbnailEl)
    }

    return _overlays
  }

  return {
    insertCcTag,
    hasCcTag,
    getVideoUrl
  }
}

/**
 * get loaded overlays
 * @param {HTMLElement} e 
 * @returns {Promise<HTMLElement>}
 */
const waitOverlayLoadedAsnyc = async e => {
  const overlays = e.querySelector('#overlays')

  if (overlays.childElementCount > 0) {
    return overlays
  }

  return new Promise(resolve => {
    let intervalId = setInterval(() => {
      if (overlays.childElementCount > 0) {
        clearInterval(intervalId)
        resolve(overlays)
      }
    }, 100)

    setTimeout(() => {
      clearInterval(intervalId)
      resolve(null)
    }, 5000)
  })
}