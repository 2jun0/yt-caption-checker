import { debug } from './utils/common.js'
import { getCaptionLanguages } from './utils/yt-info.js'
import { IndexedDB } from './store/IndexedDB.js'
import { CAPTION_STORE } from './store/contants.js'
import { createHasCaptionsListener } from './background/createHasCaptionsListener.js'

const indexedDB = new IndexedDB()

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

  const captions = await getCaptionLanguages(videoId)
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

chrome.runtime.onMessage.addListener(createHasCaptionsListener(getCaptions))
