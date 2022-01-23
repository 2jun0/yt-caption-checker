import { getYtInfo } from '../yt-info'

chrome.runtime.onMessage.addListener(({ type, value }, sender, sendRes) => {
  if (type === 'has-subtitles') {
    let { videoId, langs } = value

    getYtInfo(videoId, { credentials: 'omit' }).then((info, err) => {
      if (err) console.error(err)

      let captions = info.player_response.captions
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
