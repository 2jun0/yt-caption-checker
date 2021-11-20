const ytIframe = document.getElementById("yt-player");
let bgTabId = null;

// Get background tab id
chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
  if (tabs.length > 0) bgTabId = tabs[0].id;
});

// Load YouTube Video Iframe Url
function loadYtIframeUrl(videoId) {
  let videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&cc_load_policy=1&controls=0&disablekb=1&end=1&fs=0&start=0&mute=1`;
  ytIframe.src = videoUrl;
}

function getTimedtextUrl(videoId, callback) {
  loadYtIframeUrl(videoId);

  // Track caption request urls
  chrome.webRequest.onBeforeRequest.addListener(
    (detail) => {
      let timedtextUrl =
        detail.url.match(/(.*lang=[\w]+)&.*/)[1] + "&type=list";

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
    if (this.readyState === this.DONE && this.status === 200) {
      callback(langCodeCheck.test(this.responseText));
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
});
