import { debug } from '../utils/common.js'
import { CAPTION_STORE } from '../store/contants.js'

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
    this._inFlight = new Map()
  }

  /**
   * Get caption language codes of a video.
   * Successful lookups are cached for a day, failed lookups for
   * 10 minutes (resolving to null while fresh). Concurrent lookups
   * of the same video share one request.
   * @param {string} videoId
   * @returns {Promise<string[]|null>}
   */
  async getCaptions(videoId) {
    if (this._inFlight.has(videoId)) return this._inFlight.get(videoId)

    const lookup = this._lookup(videoId).finally(() =>
      this._inFlight.delete(videoId),
    )
    this._inFlight.set(videoId, lookup)
    return lookup
  }

  async _lookup(videoId) {
    const saved = await this.indexedDB.get(CAPTION_STORE, videoId)
    const ttlMs = saved?.failed ? FAILURE_TTL_MS : SUCCESS_TTL_MS
    if (saved && Date.now() - saved.updatedAt < ttlMs) {
      debug('captions cache hit', {
        videoId,
        ageMs: Date.now() - saved.updatedAt,
        failed: !!saved.failed,
        count: Array.isArray(saved.captions) ? saved.captions.length : 0,
      })
      return saved.failed ? null : saved.captions
    }

    debug('captions cache miss', { videoId })

    // the breaker sits inside the queue so its state is checked when
    // the task runs, not when it was enqueued
    return this.throttledQueue.run(() =>
      this.circuitBreaker.run(() => this._fetchAndCache(videoId)),
    )
  }

  async _fetchAndCache(videoId) {
    try {
      const captions = await this.fetchCaptionLanguages(videoId)
      debug('captions fetched', {
        videoId,
        count: Array.isArray(captions) ? captions.length : 0,
      })
      this.indexedDB.put(CAPTION_STORE, {
        videoId,
        captions,
        updatedAt: Date.now(),
      })
      return captions
    } catch (err) {
      this.indexedDB.put(CAPTION_STORE, {
        videoId,
        failed: true,
        updatedAt: Date.now(),
      })
      throw err
    }
  }
}
