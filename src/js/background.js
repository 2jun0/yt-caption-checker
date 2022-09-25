import { getYtInfo } from './utils/yt-info.js'

chrome.runtime.onMessage.addListener(({ type, value }, sender, sendRes) => {
  if (type === 'has-captions') {
    const { videoId, langs } = value

    getYtInfo(videoId).then((info, err) => {
      if (err) console.error(err)

      const { captions } = info.player_response
      if (!captions) return sendRes(false)

      let existsCaptions =
        captions.playerCaptionsTracklistRenderer.captionTracks.filter(
          ({ languageCode, kind }) =>
            kind !== 'asr' && langs.includes(languageCode),
        )

      return sendRes(existsCaptions.length > 0)
    })
  }

  // this will keep the message channel open to the other end until sendResponse is called
  return true
})
