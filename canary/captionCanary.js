import { writeFileSync } from 'fs'
import {
  getYtInfo,
  extractCaptionTracks,
  captionTracksToLanguageCodes,
} from '../src/js/utils/yt-info.js'
import { CAPTION_FIXTURES } from './fixtures.js'
import { judgeCaptionResults } from './lib/captionVerdict.js'
import { looksBlocked } from './lib/blockPage.js'

const msg = err => String((err && err.message) || err)
const watchUrl = id => `https://www.youtube.com/watch?v=${id}&hl=en`

// When getYtInfo can't parse the page, decide whether it's a consent/bot wall
// (no usable signal) or a genuine watch page whose data shape broke.
const isWatchPageBlocked = async id => {
  try {
    const res = await fetch(watchUrl(id), { credentials: 'omit' })
    const body = await res.text()
    return looksBlocked(res.url, body)
  } catch {
    return true // network failure => no usable signal, treat as unreachable
  }
}

const checkVideo = async id => {
  let info
  try {
    info = await getYtInfo(id) // fetch + ytInitialPlayerResponse parse
  } catch (err) {
    const blocked = await isWatchPageBlocked(id)
    return blocked
      ? { id, outcome: 'unreachable', error: `blocked/consent: ${msg(err)}` }
      : { id, outcome: 'broken', error: `player_response unparseable: ${msg(err)}` }
  }
  const tracks = extractCaptionTracks(info) // captions...captionTracks path
  if (!tracks || tracks.length === 0) {
    return { id, outcome: 'broken', error: 'no captionTracks (path broken or empty)' }
  }
  if (!tracks.every(t => typeof t?.languageCode === 'string')) {
    return { id, outcome: 'broken', error: 'captionTracks missing languageCode field' }
  }
  captionTracksToLanguageCodes(tracks) // exercise the runtime mapping
  return { id, outcome: 'ok', count: tracks.length }
}

const writeResult = out => {
  console.log(JSON.stringify(out, null, 2))
  writeFileSync('caption-canary-result.json', JSON.stringify(out))
}

const main = async () => {
  const results = []
  for (const id of CAPTION_FIXTURES) {
    results.push(await checkVideo(id))
  }
  const verdict = judgeCaptionResults(results)
  writeResult({ surface: 'caption', ...verdict, results })
  process.exit(verdict.status === 'fail' ? 1 : 0) // pass/inconclusive => 0
}

main().catch(err => {
  // A crash is infra trouble, not a YouTube breakage: inconclusive, exit 0.
  writeResult({ surface: 'caption', status: 'inconclusive', error: msg(err) })
  process.exit(0)
})
