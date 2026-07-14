import { writeFileSync } from 'fs'
import {
  getYtInfo,
  extractCaptionTracks,
  captionTracksToLanguageCodes,
} from '../src/js/utils/yt-info.js'
import { CAPTION_FIXTURES } from './fixtures.js'
import { judgeCaptionResults } from './lib/captionVerdict.js'

const checkVideo = async id => {
  try {
    const info = await getYtInfo(id) // validates fetch + ytInitialPlayerResponse regex + parse
    const tracks = extractCaptionTracks(info) // validates captions...captionTracks path
    if (!tracks || tracks.length === 0) {
      return { id, ok: false, error: 'no captionTracks (path broken or empty)' }
    }
    captionTracksToLanguageCodes(tracks) // must not throw (validates kind/languageCode fields)
    return { id, ok: true, count: tracks.length }
  } catch (err) {
    return { id, ok: false, error: String((err && err.message) || err) }
  }
}

const main = async () => {
  const results = []
  for (const id of CAPTION_FIXTURES) {
    results.push(await checkVideo(id))
  }
  const verdict = judgeCaptionResults(results)
  const out = { surface: 'caption', ...verdict, results }
  console.log(JSON.stringify(out, null, 2))
  writeFileSync('caption-canary-result.json', JSON.stringify(out))
  process.exit(verdict.status === 'pass' ? 0 : 1)
}

main()
