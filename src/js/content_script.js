import { MessageManager } from './utils/MessageManager.js'
import { getYTVideoId } from './utils/common.js'
import { getRelatedLangCodes } from './utils/lang.js'
import {
  COLOR_BG_FIELD,
  COLOR_TXT_FIELD,
  CC_PREVIEW_FONT_SIZE_FIELD,
  IS_COMBINED_REGION_FIELD,
  LANGUAGE_FIELD,
  DEFAULT_VALUE,
  Storage
} from './utils/storage.js'

// tag const values
let ccLang = DEFAULT_VALUE[LANGUAGE_FIELD]
let ccColorBg = DEFAULT_VALUE[COLOR_BG_FIELD]
let ccColorTxt = DEFAULT_VALUE[COLOR_TXT_FIELD]
let ccFontSize = DEFAULT_VALUE[CC_PREVIEW_FONT_SIZE_FIELD]
let ccCombineRegion = DEFAULT_VALUE[IS_COMBINED_REGION_FIELD]

let mainObserver
let intervalId

const setCCLang = lang => {
  if (ccLang == lang) return
  ccLang = lang
  checkAllNode()
}

const setCCColorBg = colorBg => {
  if (ccColorBg == colorBg) return
  ccColorBg = colorBg
  document.querySelectorAll('#cc-status').forEach(ccStatus => {
    ccStatus.style.backgroundColor = colorBg
  })
}

const setCCColorTxt = colortxt => {
  if (ccColorTxt == colortxt) return
  ccColorTxt = colortxt
  document.querySelectorAll('#cc-status').forEach(ccStatus => {
    ccStatus.style.color = colortxt
  })
}

const setCCFontSize = fontSize => {
  if (ccFontSize == fontSize) return
  ccFontSize = fontSize
  document.querySelectorAll('#cc-status').forEach(ccStatus => {
    ccStatus.style.fontSize = fontSize
  })
}

const setCCCombineRegion = enable => {
  ccCombineRegion = enable
  setCCLang(ccLang.split('-')[0])
}

const waitOverlayLoadedAsnyc = async e => {
  const overlays = e.querySelector('#overlays')

  return new Promise(resolve => {
    let intervalId = setInterval(() => {
      if (overlays.childElementCount > 0) {
        clearInterval(intervalId)
        return resolve(overlays)
      }
    }, 100)
  })
}

const createLoadingTag = () => {
  const ccLoading = document.createElement('div')
  ccLoading.id = 'cc-loading'
  ccLoading.style.color = ccColorTxt

  return ccLoading
}

const createCaptionTag = () => {
  const ccStatus = document.createElement('div')
  Object.assign(ccStatus, {
    id: 'cc-status',
    overlayStyle: 'DEFAULT',
    className: 'style-scope ytd-thumbnail',
    lang: ccLang,
  })
  Object.assign(ccStatus.style, {
    backgroundColor: ccColorBg,
    color: ccColorTxt,
    fontSize: ccFontSize,
  })

  const span = document.createElement('span')
  Object.assign(span, {
    className: 'style-scope ytd-thumbnail-overlay-time-status-renderer',
    ariaLabel: ccLang.toUpperCase() + ' CC',
    textContent: ccLang.toUpperCase() + ' CC',
  })

  ccStatus.appendChild(span)

  return ccStatus
}

const tagVideo = async (e, lang) => {
  const url = e.href
  if (!url) return

  const langs = ccCombineRegion ? getRelatedLangCodes(ccLang) : [lang]

  // if already tagged remove it
  let ccStatus = e.querySelector('#cc-status')
  if (ccStatus) ccStatus.remove()

  // To avoid deleting the ccStatus and ccLoading
  // Wait loading video overlays
  const overlays = await waitOverlayLoadedAsnyc(e)

  // Show the loading tag
  const ccLoading = e.querySelector('#cc-loading') || createLoadingTag()
  overlays.insertBefore(ccLoading, overlays.lastChild)

  // Check if video has captions
  if (await hasCaptions(url, langs)) {
    // Once load overlays, insert ccStatus

    ccStatus = createCaptionTag()

    // if user change langauge or url in processing,
    // Remove ccStatus and ccLoading
    if (e.href != url || ccStatus.lang != ccLang) {
      ccStatus.remove()
    } else {
      overlays.insertBefore(ccStatus, overlays.lastChild)
    }
  }

  ccLoading.remove()
}

const hasCaptions = async (videoUrl, langs) => {
  // URL example : /watch?v=[video_id]
  const videoId = getYTVideoId(videoUrl)

  return chrome.runtime.sendMessage({
    type: 'has-captions',
    value: { videoId, langs },
  })
}

const checkNodes = nodes => {
  nodes.forEach(node => {
    // is not http element
    if (['#text', '#comment'].includes(node.nodeName)) return

    node.querySelectorAll('a#thumbnail').forEach(e => {
      checkNode(e)
    })
  })
}

const checkNode = node => {
  // except thumbnail
  if (node.tagName != 'A' || node.id != 'thumbnail') return
  // except play list
  if (node.parentElement.tagName == 'YTD-PLAYLIST-THUMBNAIL') return

  tagVideo(node)
}

const checkAllNode = () => {
  const contentElement = document.querySelector('body')
  if (!contentElement) return false

  checkNodes(Array.from(contentElement.children))
}

const initObserver = () => {
  if (!('MutationObserver' in window)) return false

  let contentElement = document.querySelector('body')
  if (!contentElement) return false

  // checkNodes(Array.from(contentElement.children))

  mainObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      checkNode(mutation.target)
    })
  })
  mainObserver.observe(contentElement, {
    subtree: true,
    attributeFilter: ['href'],
  })

  clearInterval(intervalId) // Just for good measure

  return true
}

const initInterval = () => {
  intervalId = setInterval(() => {
    if (initObserver()) clearInterval(intervalId)
  }, 2000)
}

// option update handlers
const messageManager = MessageManager()
const storage = Storage(chrome.storage.local)

messageManager.addOnMessageListener(req => {
  if (LANGUAGE_FIELD in req) setCCLang(req[LANGUAGE_FIELD])
  if (COLOR_BG_FIELD in req) setCCColorBg(req[COLOR_BG_FIELD])
  if (COLOR_TXT_FIELD in req) setCCColorTxt(req[COLOR_TXT_FIELD])
  if (CC_PREVIEW_FONT_SIZE_FIELD in req) setCCFontSize(req[CC_PREVIEW_FONT_SIZE_FIELD])
  if (IS_COMBINED_REGION_FIELD in req)
    setCCCombineRegion(req[IS_COMBINED_REGION_FIELD])
})

// Load data
storage.loadData(
  [
    LANGUAGE_FIELD,
    COLOR_BG_FIELD,
    COLOR_TXT_FIELD,
    CC_PREVIEW_FONT_SIZE_FIELD,
    IS_COMBINED_REGION_FIELD
  ], items => {
    setCCLang(items[LANGUAGE_FIELD])
    setCCColorBg(items[COLOR_BG_FIELD])
    setCCColorTxt(items[COLOR_TXT_FIELD])
    setCCFontSize(items[CC_PREVIEW_FONT_SIZE_FIELD])
    setCCCombineRegion(items[IS_COMBINED_REGION_FIELD])
    initInterval()
  })