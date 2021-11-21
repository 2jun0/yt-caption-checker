let bgTabId = null;

// Get background tab id
chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
  if (tabs.length > 0) {
    bgTabId = tabs[0].id;
  }
});

function onYouTubeIframeAPIReady() {
  console.log("123");
}

// Load YouTube Video Iframe Url
function loadYtIframeUrl(videoId) {
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
      onReady: (event) => {
        ytPlayer.mute();
        // ytPlayer.pauseVideo();
      },
      onApiChange: (event) => {
        temp1.target.getOption("captions", "tracklist");
      },
    },
  });

  // let videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&cc_load_policy=1&controls=0&disablekb=1&fs=0&mute=1`;
  // ytIframe.src = videoUrl;

  //
}

function getTimedtextUrl(videoId, callback) {
  loadYtIframeUrl(videoId);

  // Capture caption request urls
  chrome.webRequest.onBeforeRequest.addListener(
    (detail) => {
      console.log("f", detail.url);

      // Prevent to capture self request
      if (/type=list/.test(detail.url)) return;
      if (!detail.url.match(/(.*lang=(\w|-)+)&.*/))
        console.log("????", detail.url);

      let timedtextUrl =
        detail.url.match(/(.*lang=(\w|-)+)&.*/)[1] + "&type=list";

      ((e) => e & e.remove())(document.getElementById(`player-${videoId}`));

      callback(timedtextUrl);
    },
    { urls: ["*://*.youtube.com/api/timedtext*"], tabId: bgTabId },
    ["requestBody"]
  );
}

function checkLangCodes(timedtextUrl, langs, callback) {
  let langCodeCheck = RegExp(`lang_code="(${langs.join("|")})"`);

  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === this.DONE) {
      if (this.status === 200) callback(langCodeCheck.test(this.responseText));
      else callback(false);
    }
  };
  xhr.open("GET", timedtextUrl);
  xhr.send();
}

// Get content script message
chrome.runtime.onMessage.addListener(({ type, value }, sender, sendRes) => {
  if (type === "has-subtitles") {
    let langs = value.langs;
    let videoId = value.videoId;

    getTimedtextUrl(videoId, (timedtextUrl) => {
      checkLangCodes(timedtextUrl, langs, sendRes);
    });
  }

  return true;
});
