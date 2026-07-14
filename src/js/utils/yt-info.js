import { parseJSON, findJSON } from './json.js'

const BASE_URL = 'https://www.youtube.com/watch?v='

export const getYtInfo = async id => {
  return await getWatchHTMLPage(id, { credentials: 'omit' })
}

const getWatchHTMLPage = async (id, options) => {
  let body = await getWatchHTMLPageBody(id, options)
  let info = { page: 'watch' }
  try {
    info.player_response = findJSON(
      'watch.html',
      'player_response',
      body,
      /\bytInitialPlayerResponse\s*=\s*\{/i,
      '</script>',
      '{',
    )
  } catch (err) {
    let args = findJSON(
      'watch.html',
      'player_response',
      body,
      /\bytplayer\.config\s*=\s*{/,
      '</script>',
      '{',
    )
    info.player_response = findPlayerResponse('watch.html', args)
  }

  return info
}

const getWatchHTMLPageBody = async (id, options) => {
  const url = getWatchHTMLURL(id, options)
  const res = await fetch(url, options)
  return res.text()
}

const getWatchHTMLURL = (id, options) => {
  return `${BASE_URL + id}&hl=${options.lang || 'en'}`
}

const findPlayerResponse = (source, info) => {
  const player_response =
    info &&
    ((info.args && info.args.player_response) ||
      info.player_response ||
      info.playerResponse ||
      info.embedded_player_response)
  return parseJSON(source, 'player_response', player_response)
}

/**
 * Extract the caption tracks array from a watch-page info object.
 * @param {{player_response?: any}} info
 * @returns {Array|null} tracks, or null when the video carries no caption metadata
 */
export const extractCaptionTracks = info => {
  const captions = info?.player_response?.captions
  if (!captions) return null
  return captions.playerCaptionsTracklistRenderer?.captionTracks ?? null
}

/**
 * Reduce caption tracks to non-auto-created language codes.
 * @param {Array} tracks
 * @returns {string[]}
 */
export const captionTracksToLanguageCodes = tracks =>
  tracks.filter(({ kind }) => kind !== 'asr').map(({ languageCode }) => languageCode)

/**
 * Fetch a video's non-auto-created caption language codes.
 * @param {string} id
 * @returns {Promise<string[]|null>}
 */
export const getCaptionLanguages = async id => {
  const info = await getYtInfo(id)
  const tracks = extractCaptionTracks(info)
  if (!tracks) return null
  return captionTracksToLanguageCodes(tracks)
}
