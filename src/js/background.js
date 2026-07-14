import { getCaptionLanguages } from './utils/yt-info.js'
import { IndexedDB } from './store/IndexedDB.js'
import { Storage } from './store/Storage.js'
import { createHasCaptionsListener } from './background/createHasCaptionsListener.js'
import { CaptionLoader } from './background/CaptionLoader.js'
import { ThrottledQueue } from './background/ThrottledQueue.js'
import { CircuitBreaker } from './background/CircuitBreaker.js'

const indexedDB = new IndexedDB()
const storage = new Storage(chrome.storage.local)
const throttledQueue = new ThrottledQueue(200)
const circuitBreaker = new CircuitBreaker(5, 60 * 1000, 30 * 60 * 1000, storage)
const captionLoader = new CaptionLoader(
  indexedDB,
  getCaptionLanguages,
  throttledQueue,
  circuitBreaker,
)

chrome.runtime.onStartup.addListener(() => {
  // nothing.
})

chrome.runtime.onMessage.addListener(
  createHasCaptionsListener(videoId => captionLoader.getCaptions(videoId)),
)
