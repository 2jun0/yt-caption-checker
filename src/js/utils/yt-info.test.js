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
  test('drops auto-created (asr) tracks and maps to languageCode', () => {
    const tracks = [
      { languageCode: 'en', kind: 'asr' },
      { languageCode: 'ko' },
      { languageCode: 'ja' },
    ]
    expect(captionTracksToLanguageCodes(tracks)).toEqual(['ko', 'ja'])
  })
})
