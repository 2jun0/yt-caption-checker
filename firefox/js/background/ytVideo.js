import {
  getLangListUrl,
  getTabId,
  getYTVideoId,
  requestAysnc,
} from '../common.js';
import {
  FIELD_VIDEO_LANG_LIST_URL,
  loadDataAsync,
  saveData,
} from '../storage.js';

let TabId;
getTabId(tabId => (TabId = tabId));

let waittingIntervals = {};

// Load YouTube Video Iframe Url
async function loadYtPlayerAsync(videoId) {
  return new Promise(resolve => {
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
          resolve();
        },
      },
    });
  });
}

async function createWattingIntervalAsync(videoId) {
  const vLangListUrlField = `${FIELD_VIDEO_LANG_LIST_URL}_${videoId}`;

  return new Promise(resolve => {
    let count = 0;
    waittingIntervals[videoId] = {
      id: setInterval(() => {
        // during 1 sec, wait web request
        if (count >= 60) {
          resolve();
          return;
        }

        // when find timedtext url, save url and return
        if (waittingIntervals[videoId].langListUrl) {
          saveData(vLangListUrlField, waittingIntervals[videoId].langListUrl);
          resolve(waittingIntervals[videoId].langListUrl);
          return;
        }
        count++;
      }, 1000),
    };
  }).then(langListUrl => {
    // remove yt player and interval
    document.getElementById(`player-${videoId}`).remove();
    clearInterval(waittingIntervals[videoId].id);
    return langListUrl;
  });
}

async function getLangListUrlAsync(videoId) {
  const vLangListUrlField = `${FIELD_VIDEO_LANG_LIST_URL}_${videoId}`;

  return loadDataAsync(vLangListUrlField).then(items => {
    let langListUrl = items[vLangListUrlField];

    if (langListUrl) {
      // already saved
      return langListUrl;
    } else {
      // load Youtube Player (wait until the "onReady" event occurs)
      return loadYtPlayerAsync(videoId).then(() => {
        return createWattingIntervalAsync(videoId);
      });
    }
  });
}

async function hasSubtitlesAsync(videoId, langs) {
  const langCodeCheck = RegExp(`lang_code="(${langs.join('|')})"`);

  return getLangListUrlAsync(videoId).then(langListUrl => {
    if (!langListUrl) {
      return false;
    } else {
      return requestAysnc('GET', langListUrl).then(res => {
        return langCodeCheck.test(res);
      });
    }
  });
}

// Get web Request
chrome.webRequest.onBeforeRequest.addListener(
  details => {
    let videoId = getYTVideoId(details.url);
    let langListUrl = getLangListUrl(details.url);

    if (waittingIntervals[videoId])
      waittingIntervals[videoId].langListUrl = langListUrl;
  },
  { tabId: TabId, urls: ['*://*.youtube.com/api/timedtext*'] },
  ['requestBody'],
);

// Get content script message
chrome.runtime.onMessage.addListener(({ type, value }, sender, sendRes) => {
  if (type === 'has-subtitles') {
    let langs = value.langs;
    let videoId = value.videoId;

    hasSubtitlesAsync(videoId, langs).then(sendRes);
  }
  return true; // Inform Chrome that we will make a delayed sendResponse
});
