import { getCaptionLanguages } from './utils/yt-info.js'
import { IndexedDB } from './store/IndexedDB.js'
import { Storage } from './store/Storage.js'
import { CIRCUIT_STATE_FIELD } from './store/contants.js'
import { createHasCaptionsListener } from './background/createHasCaptionsListener.js'
import { CaptionLoader } from './background/CaptionLoader.js'
import { ThrottledQueue } from './background/ThrottledQueue.js'
import { CircuitBreaker } from './background/CircuitBreaker.js'

const MIN_FETCH_INTERVAL_MS = 200 // 5 fetches per second
const FAILURE_THRESHOLD = 5
const INITIAL_BACKOFF_MS = 60 * 1000
const MAX_BACKOFF_MS = 30 * 60 * 1000

const captionLoader = new CaptionLoader(
  new IndexedDB(),
  getCaptionLanguages,
  new ThrottledQueue(MIN_FETCH_INTERVAL_MS),
  new CircuitBreaker(
    FAILURE_THRESHOLD,
    INITIAL_BACKOFF_MS,
    MAX_BACKOFF_MS,
    new Storage(chrome.storage.local),
    CIRCUIT_STATE_FIELD,
  ),
)

chrome.runtime.onStartup.addListener(() => {
  // nothing.
})

chrome.runtime.onMessage.addListener(
  createHasCaptionsListener(videoId => captionLoader.getCaptions(videoId)),
)
