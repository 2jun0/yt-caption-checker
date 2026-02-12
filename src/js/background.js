import { debug } from './utils/common.js'
import { getYtInfo } from './utils/yt-info.js'
import { IndexedDB } from './store/IndexedDB.js'
import { CAPTION_STORE } from './store/contants.js'

const indexedDB = new IndexedDB()

async function getCaptionsFromYt(videoId) {
  const info = await getYtInfo(videoId)
  const { captions } = info.player_response

  if (!captions) {
    return null
  }

  /** @type{Array} */
  const captionTracks = captions.playerCaptionsTracklistRenderer.captionTracks

  return captionTracks
    .filter(
      // filter not auto-created
      ({ kind }) => kind !== 'asr',
    )
    .map(
      // get languageCode only
      ({ languageCode }) => languageCode,
    )
}

async function getCaptions(videoId) {
  if (!indexedDB._db) {
    await indexedDB.init()
    debug('indexedDB initialized')
  }

  const saved = await indexedDB.get(CAPTION_STORE, videoId)
  if (saved && Date.now() - saved['updatedAt'] < 1000 * 3600 * 24) {
    debug('captions cache hit', {
      videoId,
      ageMs: Date.now() - saved['updatedAt'],
      count: Array.isArray(saved['captions']) ? saved['captions'].length : 0,
    })
    return saved['captions']
  }

  debug('captions cache miss', { videoId })

  const captions = await getCaptionsFromYt(videoId)
  debug('captions fetched', {
    videoId,
    count: Array.isArray(captions) ? captions.length : 0,
  })
  indexedDB.put(CAPTION_STORE, {
    videoId: videoId,
    captions,
    updatedAt: Date.now(),
  })
  return captions
}

chrome.runtime.onStartup.addListener(() => {
  // nothing.
})

chrome.runtime.onMessage.addListener(({ type, value }, sender, sendRes) => {
  if (type === 'has-captions') {
    const { videoId, languages } = value

    debug('message: has-captions', {
      videoId,
      languages,
      sender: sender?.id,
    })

    getCaptions(videoId).then(captions => {
      if (!captions) {
        debug('no captions', { videoId })
        return sendRes(false)
      }

      const existsCaptions = captions.filter(languageCode =>
        languages.includes(languageCode),
      )

      debug('caption match result', {
        videoId,
        matched: existsCaptions,
        matchedCount: existsCaptions.length,
        captionsCount: captions.length,
      })

      return sendRes(existsCaptions.length > 0)
    })
  }

  // this will keep the message channel open to the other end until sendResponse is called
  return true
})
