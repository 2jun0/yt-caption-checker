import {
  getLangListUrl,
  getTabId,
  getYTVideoId,
  requestAysnc,
} from '../common.js';
import {
  FIELD_VIDEO_LANG_LIST_URL,
  loadDataAsync,
  saveDataAsync,
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

          // Has no captions
          if (
            ytPlayer.getOptions &&
            ytPlayer.getOptions('captions').length === 0
          ) {
            return resolve(false);
          }

          // Has only auto-generated captions
          if (
            ytPlayer.getOption &&
            ytPlayer.setOption('captions', 'tracklist').length === 0
          ) {
            return resolve(false);
          }

          // Has any captions
          return resolve(true);
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
      id: setInterval(async () => {
        // during 30 sec, wait web request
        if (count >= 300) return resolve();

        // when find timedtext url, save url and return
        if (waittingIntervals[videoId].langListUrl) {
          await saveDataAsync(
            vLangListUrlField,
            waittingIntervals[videoId].langListUrl,
          );
          return resolve(waittingIntervals[videoId].langListUrl);
        }
        count++;
      }, 100),
    };
  });
}

async function getLangListUrlByIframeUrlAsync(videoId) {
  // load Youtube Player (wait until the "onReady" event occurs)
  return loadYtPlayerAsync(videoId)
    .then(hasAnyCaptions => {
      return hasAnyCaptions ? createWattingIntervalAsync(videoId) : null;
    })
    .then(langListUrl => {
      // remove yt player and interval
      document.getElementById(`player-${videoId}`).remove();

      if (waittingIntervals[videoId]) {
        clearInterval(waittingIntervals[videoId].id);
        delete waittingIntervals[videoId];
      }

      return langListUrl;
    });
}

async function getLangListUrlByStorageAsync(videoId) {
  const vLangListUrlField = `${FIELD_VIDEO_LANG_LIST_URL}_${videoId}`;

  return loadDataAsync(vLangListUrlField).then(items => {
    // Test if url is vaild
    if (!items[vLangListUrlField]) return null;

    return requestAysnc('GET', items[vLangListUrlField]).then(res => {
      return res ? items[vLangListUrlField] : null;
    });
  });
}

async function hasSubtitlesAsync(videoId, langs) {
  const langCodeCheck = RegExp(`lang_code="(${langs.join('|')})"`);

  let langListUrl = await getLangListUrlByStorageAsync(videoId);

  if (!langListUrl) langListUrl = await getLangListUrlByIframeUrlAsync(videoId);

  if (!langListUrl) return false;

  return requestAysnc('GET', langListUrl).then(res => {
    return res ? langCodeCheck.test(res) : false;
  });
}

// Get web Request
chrome.webRequest.onBeforeRequest.addListener(
  details => {
    // Avoid self check
    if (details.url.includes('type=list')) return;

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
    const langs = value.langs;
    const videoId = value.videoId;

    hasSubtitlesAsync(videoId, langs).then(sendRes);
  }
  return true; // Inform Chrome that we will make a delayed sendResponse
});
