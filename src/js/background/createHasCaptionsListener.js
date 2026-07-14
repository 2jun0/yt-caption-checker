import { debug } from '../utils/common.js'

/**
 * Create the runtime.onMessage listener answering 'has-captions' queries.
 * Every 'has-captions' message receives a response; a failed lookup
 * responds false.
 * @param {(videoId: string) => Promise<string[]|null>} getCaptions
 */
export const createHasCaptionsListener =
  getCaptions =>
  ({ type, value }, sender, sendRes) => {
    if (type !== 'has-captions') return false

    const { videoId, languages } = value

    debug('message: has-captions', {
      videoId,
      languages,
      sender: sender?.id,
    })

    getCaptions(videoId)
      .then(captions => {
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
      .catch(err => {
        debug('caption lookup failed', {
          videoId,
          error: String((err && err.message) || err),
        })
        sendRes(false)
      })

    // this will keep the message channel open to the other end until sendResponse is called
    return true
  }
