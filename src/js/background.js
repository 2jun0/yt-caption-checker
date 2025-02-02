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
  }

  const saved = await indexedDB.get(CAPTION_STORE, videoId)
  if (saved && Date.now() - saved['updatedAt'] < 1000 * 3600 * 24) {
    return saved['captions']
  }

  const captions = await getCaptionsFromYt(videoId)
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

    getCaptions(videoId).then(captions => {
      if (!captions) return sendRes(false)

      let existsCaptions = captions.filter(languageCode =>
        languages.includes(languageCode),
      )

      return sendRes(existsCaptions.length > 0)
    })
  }

  // this will keep the message channel open to the other end until sendResponse is called
  return true
})
