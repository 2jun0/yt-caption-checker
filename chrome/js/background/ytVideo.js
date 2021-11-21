let bgTabId = null;

// Get background tab id
chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
  if (tabs.length > 0) {
    bgTabId = tabs[0].id;
  }
});

// Load YouTube Video Iframe Url
function loadYtPlayer(videoId, callback) {
  // Already exists
  if (document.getElementById(`player-${videoId}`)) return;

  let playerElm = document.createElement("div");
  playerElm.id = `player-${videoId}`;
  document.body.appendChild(playerElm);

  let ytPlayer = new YT.Player(`player-${videoId}`, {
    videoId: videoId,
    playerVars: {
      cc_load_policy: 1,
      autoplay: 1,
      origin: window.location.origin,
    },
    events: {
      onReady: ({ target, data }) => {
        ytPlayer.mute();

        // Wait until the option is loaded.
        let intervalId = setInterval(() => {
          let ccList = ytPlayer.getOption("captions", "tracklist");
          if (ccList) {
            clearInterval(intervalId);
            callback(ytPlayer);
            return;
          }
        }, 100);
      },
    },
  });
}

function checkLangCodes(videoId, langs, callback) {
  let hasSubtitles = false;
  let langCodeCheck = RegExp(`(${langs.join("|")})`);

  loadYtPlayer(videoId, (ytPlayer) => {
    let ccList = ytPlayer.getOption("captions", "tracklist");

    ccList.forEach((cc) => {
      hasSubtitles ||= langCodeCheck.test(cc.languageCode);
    });

    callback(hasSubtitles);
    ytPlayer.destroy();
  });
}

// Get content script message
chrome.runtime.onMessage.addListener(({ type, value }, sender, sendRes) => {
  if (type === "has-subtitles") {
    let langs = value.langs;
    let videoId = value.videoId;

    checkLangCodes(videoId, langs, sendRes);
  }

  return true;
});
