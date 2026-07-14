import { debug } from '../utils/common.js'
import { IndexedDB } from '../store/IndexedDB.js'
import { CAPTION_STORE } from '../store/contants.js'
import { ThrottledQueue } from './ThrottledQueue.js'
import { CircuitBreaker, CircuitOpenError } from './CircuitBreaker.js'

const SUCCESS_TTL_MS = 1000 * 3600 * 24
const FAILURE_TTL_MS = 1000 * 60 * 10

export class CaptionLoader {
  /**
   * @param {IndexedDB} indexedDB
   * @param {(videoId: string) => Promise<string[]|null>} fetchCaptionLanguages
   * @param {ThrottledQueue} throttledQueue
   * @param {CircuitBreaker} circuitBreaker
   */
  constructor(indexedDB, fetchCaptionLanguages, throttledQueue, circuitBreaker) {
    this.indexedDB = indexedDB
    this.fetchCaptionLanguages = fetchCaptionLanguages
    this.throttledQueue = throttledQueue
    this.circuitBreaker = circuitBreaker
  }

  /**
   * Get caption language codes of a video.
   * Successful lookups are cached for a day, failed lookups for
   * 10 minutes (resolving to null while fresh).
   * @param {string} videoId
   * @returns {Promise<string[]|null>}
   */
  async getCaptions(videoId) {
    if (!this.indexedDB._db) {
      await this.indexedDB.init()
      debug('indexedDB initialized')
    }

    const saved = await this.indexedDB.get(CAPTION_STORE, videoId)
    if (saved && Date.now() - saved['updatedAt'] < this._ttlOf(saved)) {
      debug('captions cache hit', {
        videoId,
        ageMs: Date.now() - saved['updatedAt'],
        failed: !!saved['failed'],
        count: Array.isArray(saved['captions']) ? saved['captions'].length : 0,
      })
      return saved['failed'] ? null : saved['captions']
    }

    debug('captions cache miss', { videoId })

    const captions = await this._fetchCaptions(videoId)
    debug('captions fetched', {
      videoId,
      count: Array.isArray(captions) ? captions.length : 0,
    })
    this.indexedDB.put(CAPTION_STORE, {
      videoId: videoId,
      captions,
      updatedAt: Date.now(),
    })
    return captions
  }

  _ttlOf(saved) {
    return saved['failed'] ? FAILURE_TTL_MS : SUCCESS_TTL_MS
  }

  async _fetchCaptions(videoId) {
    try {
      return await this.throttledQueue.run(() =>
        this.circuitBreaker.run(() => this.fetchCaptionLanguages(videoId)),
      )
    } catch (err) {
      // a fast-fail from the open circuit is not a lookup result for this video
      if (!(err instanceof CircuitOpenError)) {
        this.indexedDB.put(CAPTION_STORE, {
          videoId: videoId,
          failed: true,
          updatedAt: Date.now(),
        })
      }
      throw err
    }
  }
}
