import { FIELD_VIDEO_LANGS, loadData, saveData } from '../storage.js';

// Load YouTube Video Iframe Url
function loadYtPlayer(videoId, callback) {
  // Already exists
  if (document.getElementById(`player-${videoId}`)) return;

  let playerElm = document.createElement('div');
  playerElm.id = `player-${videoId}`;
  document.body.appendChild(playerElm);

  let ytPlayer = new YT.Player(`player-${videoId}`, {
    videoId: videoId,
    playerVars: {
      autoplay: 1,
      cc_load_policy: 1,
      suggestedQuality: 'tiny',
    },
    events: {
      onReady: ({ target, data }) => {
        ytPlayer.pauseVideo();

        // Wait until the option is loaded.
        let count = 0;
        let intervalId = setInterval(() => {
          let ccList = ytPlayer.getOption('captions', 'tracklist');
          // over 60 sec => video doesn't have any captions
          if (ccList || count > 600) {
            clearInterval(intervalId);
            callback(ytPlayer);
            return;
          }
          count++;
        }, 100);
      },
    },
  });
}

function checkLangCodes(videoId, langs, callback) {
  const langCodeCheck = RegExp(`(${langs.join('|')})`);
  const vLangField = `${FIELD_VIDEO_LANGS}_${videoId}`;

  loadData(vLangField, items => {
    if (items[vLangField]) {
      const langCodes = items[vLangField].langCodes;
      const searchTime = items[vLangField].searchTime;

      // After one day, the search starts again.
      if (Date.now() - searchTime < 86400000) {
        callback(langCodeCheck.test(langCodes));
        return;
      }
    }

    // The subtitle search start
    loadYtPlayer(videoId, ytPlayer => {
      let langCodeList = (
        ytPlayer.getOption('captions', 'tracklist') || []
      ).map(cc => cc.languageCode);

      let hasSubtitles = false;
      langCodeList.forEach(langCode => {
        hasSubtitles ||= langCodeCheck.test(langCode);
      });

      saveData(vLangField, {
        langCodes: langCodeList.join(','),
        searchTime: Date.now(),
      });
      // remove yt player
      document.getElementById(`player-${videoId}`).remove();

      callback(hasSubtitles);
    });
  });
}

// Get content script message
chrome.runtime.onMessage.addListener(({ type, value }, sender, sendRes) => {
  if (type === 'has-subtitles') {
    let langs = value.langs;
    let videoId = value.videoId;

    checkLangCodes(videoId, langs, sendRes);
  }
  return true; // Inform Chrome that we will make a delayed sendResponse
});
