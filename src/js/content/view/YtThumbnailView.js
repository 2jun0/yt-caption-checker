import { InvalidYouTubeThumnailElementError } from '../../utils/errors.js'
import { CC_TAG_ID, CcTagView } from './CcTagView.js'

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

  validateThumbnailElementTagName(thumbnailEl)
  validateThumbnailElementId(thumbnailEl)
  validateThumbnailElementHref(thumbnailEl)

  /**
   * insert cc tag in YouTube thumbnail
   * @param {CcTagView} ccTagView
   */
  const insertCcTag = async ccTagView => {
    const overlays = await getOverlays()
    // time out
    if (!overlays || (await hasCcTag())) return

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
    getVideoUrl,
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

  let timer = null

  return new Promise(resolve => {
    const observer = new MutationObserver(() => {
      if (overlays.childElementCount > 0) {
        observer.disconnect()
        clearTimeout(timer)
        return resolve(overlays)
      }
    })
    observer.observe(e, {
      childList: true,
      subtree: true,
    })

    timer = setTimeout(() => {
      observer.disconnect()
      resolve(null)
    }, 5000)
  })
}

const validateThumbnailElementTagName = el => {
  if (el.tagName != 'A') {
    throw new InvalidYouTubeThumnailElementError(`tag name of thumbnail element is not 'A' (it is ${el.tagName})`)
  }
}

const validateThumbnailElementId = el => {
  if (el.id != 'thumbnail') {
    throw new InvalidYouTubeThumnailElementError(`id of thumbnail element is not 'thumbnail' (it is ${el.id})`)
  }
}

const validateThumbnailElementHref = el => {
  if (!el.href) {
    throw new InvalidYouTubeThumnailElementError(`thumbnail element hasn't href property`)
  }
}