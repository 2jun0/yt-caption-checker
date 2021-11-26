(async () => {
  // dynamic import
  const { getRelatedLangCodes } = await import(
    chrome.runtime.getURL("js/lang.js")
  );
  const {
    FIELD_COLOR_BG,
    FIELD_COLOR_TXT,
    FIELD_TAG_FONT_SIZE,
    FIELD_COMBINE_REGION,
    FIELD_LANG,
    DEFAULT_VALUE,
    loadData,
  } = await import(chrome.runtime.getURL("js/storage.js"));

  let ccLang = DEFAULT_VALUE[FIELD_LANG];
  let ccColorBg = DEFAULT_VALUE[FIELD_COLOR_BG];
  let ccColorTxt = DEFAULT_VALUE[FIELD_COLOR_TXT];
  let ccFontSize = DEFAULT_VALUE[FIELD_TAG_FONT_SIZE];
  let ccCombineRegion = DEFAULT_VALUE[FIELD_COMBINE_REGION];

  let mainObserver;
  let intervalId;

  function setCCLang(lang) {
    if (ccLang == lang) return;
    ccLang = lang;
    checkAllNode();
  }

  function setCCColorBg(colorBg) {
    if (ccColorBg == colorBg) return;
    ccColorBg = colorBg;
    document.querySelectorAll("#cc-status").forEach((ccStatus) => {
      ccStatus.style.backgroundColor = colorBg;
    });
  }

  function setCCColorTxt(colortxt) {
    if (ccColorTxt == colortxt) return;
    ccColorTxt = colortxt;
    document.querySelectorAll("#cc-status").forEach((ccStatus) => {
      ccStatus.style.color = colortxt;
    });
  }

  function setCCFontSize(fontSize) {
    if (ccFontSize == fontSize) return;
    ccFontSize = fontSize;
    document.querySelectorAll("#cc-status").forEach((ccStatus) => {
      ccStatus.style.fontSize = fontSize;
    });
  }

  function setCCCombineRegion(enable) {
    ccCombineRegion = enable;
    setCCLang(ccLang.split("-")[0]);
  }

  function waitOverlayLoaded(e, callback) {
    let overlays = e.querySelector("#overlays");

    let intervalId = setInterval(() => {
      if (overlays.childElementCount < 2) return;

      callback(overlays);

      clearInterval(intervalId);
    }, 100);
  }

  function showTagLoading(e) {
    // To avoid deleting the ccLoading,
    // Wait loading video overlays
    waitOverlayLoaded(e, (overlays) => {
      if (overlays.querySelector("#cc-loading")) return;

      let ccLoading = document.createElement("div");
      ccLoading.id = "cc-loading";
      ccLoading.style.color = ccColorTxt;

      overlays.insertBefore(ccLoading, overlays.lastChild);
    });
  }

  function tagVideo(e, lang) {
    let url = e.href;
    if (!url) return;

    let ccStatus = e.querySelector("#cc-status");
    // if already tagged remove it
    if (ccStatus) ccStatus.remove();

    // Show tag loading
    showTagLoading(e);

    let callback = (hasSubtitle) => {
      // To avoid deleting the ccStatus,
      // Wait loading video overlays
      waitOverlayLoaded(e, (overlays) => {
        function removeLoading() {
          let ccLoading = overlays.querySelector("#cc-loading");
          if (ccLoading) ccLoading.remove();
        }

        if (!hasSubtitle) {
          removeLoading();
          return;
        }
        // Once load overlays, insert ccStatus
        ccStatus = document.createElement("div");
        ccStatus.id = "cc-status";
        ccStatus.overlayStyle = "DEFAULT";
        ccStatus.className = "style-scope ytd-thumbnail";
        ccStatus.style.backgroundColor = ccColorBg;
        ccStatus.style.color = ccColorTxt;
        ccStatus.style.fontSize = ccFontSize;
        ccStatus.lang = ccLang;

        let span = document.createElement("span");
        span.className =
          "style-scope ytd-thumbnail-overlay-time-status-renderer";
        span.ariaLabel = ccLang.toUpperCase() + " CC";
        span.textContent = ccLang.toUpperCase() + " CC";
        ccStatus.appendChild(span);

        // if user change langauge or url in processing,
        // Remove ccStatus
        if (e.href != url || ccStatus.lang != ccLang) ccStatus.remove();
        removeLoading();
        overlays.insertBefore(ccStatus, overlays.lastChild);
      });
    };

    if (ccCombineRegion) {
      let langs = getRelatedLangCodes(ccLang);
      hasSubtitles(url, langs, callback);
    } else {
      hasSubtitles(url, [lang], callback);
    }
  }

  function hasSubtitles(videoUrl, langs, callback) {
    // URL example : /watch?v=[video_id]

    chrome.runtime.sendMessage(
      {
        type: "has-subtitles",
        value: { langs, videoId },
      },
      callback
    );
    const videoId = videoUrl.match(/\?v=([\w-]+)/)[1];
  }

  function checkNodes(nodes) {
    nodes.forEach((node) => {
      // is not http element
      if (["#text", "#comment"].includes(node.nodeName)) return;

      node.querySelectorAll("a#thumbnail").forEach((e) => {
        checkNode(e);
      });
    });
  }

  function checkNode(node) {
    if (node.tagName != "A" || node.id != "thumbnail") {
      // if (node.id == 'video-title') console.log(node);
      return;
    }
    // except play list
    if (node.parentElement.tagName == "YTD-PLAYLIST-THUMBNAIL") return;
    addVideo(node);
  }

  function addVideo(video) {
    tagVideo(video, ccLang);
  }

  function checkAllNode() {
    let contentElement = document.querySelector("body");
    if (!contentElement) return false;

    checkNodes(Array.from(contentElement.children));
  }

  function initObserver() {
    if (!("MutationObserver" in window)) return false;

    let contentElement = document.querySelector("body");
    if (!contentElement) return false;

    checkNodes(Array.from(contentElement.children));

    mainObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        checkNode(mutation.target);
      });
    });
    mainObserver.observe(contentElement, {
      subtree: true,
      attributeFilter: ["href"],
    });

    clearInterval(intervalId); // Just for good measure

    return true;
  }

  function initInterval() {
    intervalId = setInterval(() => {
      if (initObserver()) clearInterval(intervalId);
    }, 2000);
  }

  // option update handlers
  chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
    if (FIELD_LANG in req) setCCLang(req[FIELD_LANG]);
    if (FIELD_COLOR_BG in req) setCCColorBg(req[FIELD_COLOR_BG]);
    if (FIELD_COLOR_TXT in req) setCCColorTxt(req[FIELD_COLOR_TXT]);
    if (FIELD_TAG_FONT_SIZE in req) setCCFontSize(req[FIELD_TAG_FONT_SIZE]);
    if (FIELD_COMBINE_REGION in req)
      setCCCombineRegion(items[FIELD_COMBINE_REGION]);
  });

  // Load data
  loadData(
    [
      FIELD_LANG,
      FIELD_COLOR_BG,
      FIELD_COLOR_TXT,
      FIELD_TAG_FONT_SIZE,
      FIELD_COMBINE_REGION,
    ],
    (items) => {
      setCCLang(items[FIELD_LANG]);
      setCCColorBg(items[FIELD_COLOR_BG]);
      setCCColorTxt(items[FIELD_COLOR_TXT]);
      setCCFontSize(items[FIELD_TAG_FONT_SIZE]);
      setCCCombineRegion(items[FIELD_COMBINE_REGION]);
      initInterval();
    }
  );
})();
