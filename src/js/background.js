import { debug } from './utils/common.js'
import { getCaptionLanguages } from './utils/yt-info.js'
import { IndexedDB } from './store/IndexedDB.js'
import { createHasCaptionsListener } from './background/createHasCaptionsListener.js'
import { createGetCaptions } from './background/createGetCaptions.js'
import { ThrottledQueue } from './background/ThrottledQueue.js'
import { CircuitBreaker } from './background/CircuitBreaker.js'

const indexedDB = new IndexedDB()

let dbReady = null
const initDb = () =>
  (dbReady ??= indexedDB.init().then(() => debug('indexedDB initialized')))

const store = {
  get: async (storeName, key) => {
    await initDb()
    return indexedDB.get(storeName, key)
  },
  put: async (storeName, value) => {
    await initDb()
    return indexedDB.put(storeName, value)
  },
}

const queue = new ThrottledQueue(200)

const breaker = new CircuitBreaker({
  failureThreshold: 5,
  initialBackoffMs: 60 * 1000,
  maxBackoffMs: 30 * 60 * 1000,
  storageKey: 'caption-circuit',
  storage: {
    get: async key => (await chrome.storage.local.get(key))[key],
    set: (key, value) => chrome.storage.local.set({ [key]: value }),
  },
})

const getCaptions = createGetCaptions({
  store,
  fetchLanguages: getCaptionLanguages,
  pipeline: task => queue.run(() => breaker.run(task)),
})

chrome.runtime.onStartup.addListener(() => {
  // nothing.
})

chrome.runtime.onMessage.addListener(createHasCaptionsListener(getCaptions))
