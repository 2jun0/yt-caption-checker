import { debug } from '../utils/common.js'
import { CAPTION_STORE } from '../store/contants.js'

const SUCCESS_TTL_MS = 24 * 3600 * 1000
const FAILURE_TTL_MS = 10 * 60 * 1000

/**
 * Create the cached caption lookup.
 * Successful lookups are cached for 24 hours. Failed lookups are cached
 * for 10 minutes as a failure marker (resolving to null) and rethrown
 * on first occurrence.
 * @param {{
 *   store: {get: (store: string, key: string) => Promise<any>, put: (store: string, value: any) => Promise<void>},
 *   fetchLanguages: (videoId: string) => Promise<string[]|null>,
 *   pipeline: (task: () => Promise<any>) => Promise<any>,
 * }} deps
 * @returns {(videoId: string) => Promise<string[]|null>}
 */
export const createGetCaptions = ({ store, fetchLanguages, pipeline }) => {
  return async videoId => {
    const saved = await store.get(CAPTION_STORE, videoId)
    if (saved) {
      const age = Date.now() - saved.updatedAt
      const ttl = saved.failed ? FAILURE_TTL_MS : SUCCESS_TTL_MS
      if (age < ttl) {
        debug('captions cache hit', {
          videoId,
          ageMs: age,
          failed: !!saved.failed,
          count: Array.isArray(saved.captions) ? saved.captions.length : 0,
        })
        return saved.failed ? null : saved.captions
      }
    }

    debug('captions cache miss', { videoId })

    let captions
    try {
      captions = await pipeline(() => fetchLanguages(videoId))
    } catch (err) {
      // a fast-fail from the open circuit is not a lookup result for this video
      if (err?.name !== 'CircuitOpenError') {
        store.put(CAPTION_STORE, {
          videoId,
          failed: true,
          updatedAt: Date.now(),
        })
      }
      throw err
    }

    debug('captions fetched', {
      videoId,
      count: Array.isArray(captions) ? captions.length : 0,
    })
    store.put(CAPTION_STORE, {
      videoId,
      captions,
      updatedAt: Date.now(),
    })
    return captions
  }
}
