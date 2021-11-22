(async () => {
  // dynamic import
  const { getRelatedLangCodes } = await import(
    chrome.runtime.getURL("js/lang.js")
  );

  var ccLang = "??";
  var ccColor1 = "#00000099";
  var ccColor2 = "#FFFFFF";
  var ccFontSize = "1.2rem";
  var ccCombineRegion = true;

  var mainObserver;

  function setCCLang(lang) {
    if (ccLang == lang) return;
    ccLang = lang;
    checkAllNode();
  }

  function setCCColor1(color1) {
    if (ccColor1 == color1) return;
    ccColor1 = color1;
    document.querySelectorAll("#cc-status").forEach((ccStatus) => {
      ccStatus.style.backgroundColor = color1;
    });
  }

  function setCCColor2(color2) {
    if (ccColor2 == color2) return;
    ccColor2 = color2;
    document.querySelectorAll("#cc-status").forEach((ccStatus) => {
      ccStatus.style.color = color2;
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
      ccLoading.style.color = ccColor2;

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

    var callback = (hasSubtitle) => {
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
        ccStatus.style.backgroundColor = ccColor1;
        ccStatus.style.color = ccColor2;
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
    var videoId = videoUrl.match(/\?v=([\w-]+)/)[1];

    chrome.runtime.sendMessage(
      {
        type: "has-subtitles",
        value: { langs, videoId },
      },
      callback
    );
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
    var contentElement = document.querySelector("body");
    if (!contentElement) return false;

    checkNodes(Array.from(contentElement.children));
  }

  function initObserver() {
    if (!("MutationObserver" in window)) return false;

    var contentElement = document.querySelector("body");
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

    clearTimeout(timeoutId); // Just for good measure

    return true;
  }

  var timeoutId;

  function initTimeout() {
    clearTimeout(timeoutId);

    if (initObserver()) return;

    timeoutId = setTimeout(function () {
      initTimeout();
    }, 2000);
  }

  // option update handlers
  chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
    if ("YT-SUBTITLE-FILTER_lang" in req)
      setCCLang(req["YT-SUBTITLE-FILTER_lang"]);
    if ("YT-SUBTITLE-FILTER_color1" in req)
      setCCColor1(req["YT-SUBTITLE-FILTER_color1"]);
    if ("YT-SUBTITLE-FILTER_color2" in req)
      setCCColor2(req["YT-SUBTITLE-FILTER_color2"]);
    if ("YT-SUBTITLE-FILTER_tag-font-size" in req)
      setCCFontSize(req["YT-SUBTITLE-FILTER_tag-font-size"]);
    if ("YT-SUBTITLE-FILTER_combine-region" in req)
      setCCCombineRegion(items["YT-SUBTITLE-FILTER_combine-region"]);
  });

  // Load data
  chrome.storage.local.get(
    [
      "YT-SUBTITLE-FILTER_lang",
      "YT-SUBTITLE-FILTER_color1",
      "YT-SUBTITLE-FILTER_color2",
      "YT-SUBTITLE-FILTER_tag-font-size",
      "YT-SUBTITLE-FILTER_combine-region",
    ],
    (items) => {
      setCCLang(items["YT-SUBTITLE-FILTER_lang"] || "en");
      setCCColor1(items["YT-SUBTITLE-FILTER_color1"] || "#00000099");
      setCCColor2(items["YT-SUBTITLE-FILTER_color2"] || "#FFFFFF");
      setCCFontSize(items["YT-SUBTITLE-FILTER_tag-font-size"] || "1.2rem");
      setCCCombineRegion(
        "YT-SUBTITLE-FILTER_combine-region" in items
          ? items["YT-SUBTITLE-FILTER_combine-region"]
          : true
      );
      initTimeout();
    }
  );
})();
