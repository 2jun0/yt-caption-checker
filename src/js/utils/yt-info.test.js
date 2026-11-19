import {
  extractCaptionTracks,
  captionTracksToLanguageCodes,
} from './yt-info.js'

const infoWith = tracks => ({
  page: 'watch',
  player_response: {
    captions: { playerCaptionsTracklistRenderer: { captionTracks: tracks } },
  },
})

describe('extractCaptionTracks', () => {
  test('returns the captionTracks array', () => {
    const tracks = [{ languageCode: 'en', kind: 'asr' }, { languageCode: 'ko' }]
    expect(extractCaptionTracks(infoWith(tracks))).toEqual(tracks)
  })

  test('returns null when captions metadata is missing', () => {
    expect(extractCaptionTracks({ player_response: {} })).toBeNull()
    expect(extractCaptionTracks({})).toBeNull()
  })
})

describe('captionTracksToLanguageCodes', () => {
  test('includes auto-created (asr) tracks and de-duplicates codes', () => {
    const tracks = [
      { languageCode: 'en', kind: 'asr' },
      { languageCode: 'ko' },
      { languageCode: 'ko', kind: 'asr' },
      { languageCode: 'ja' },
    ]
    expect(captionTracksToLanguageCodes(tracks)).toEqual(['en', 'ko', 'ja'])
  })

  test('skips tracks without a languageCode', () => {
    expect(captionTracksToLanguageCodes([{ kind: 'asr' }])).toEqual([])
  })
})
