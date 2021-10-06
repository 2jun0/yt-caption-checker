var ccLang = 'en';
var ccColor1 = '#008000';
var ccColor2 = '#ffffff';

var mainObserver;

function setCCLang(lang) {
  if (ccLang == lang) return;
  ccLang = lang;
  checkAllNode();
}

function setCCColor1(color1) {
  if (ccColor1 == color1) return;
  ccColor1 = color1;
  document.querySelectorAll('#cc-status').forEach(ccStatus => {
    ccStatus.style.backgroundColor = color1;
  });
}

function setCCColor2(color2) {
  if (ccColor2 == color2) return;
  ccColor2 = color2;
  document.querySelectorAll('#cc-status').forEach(ccStatus => {
    ccStatus.style.color = color2;
  });
}

function tagVideo(e, lang) {
  var url = e.href;
  
  if (url) {
    var overlays = e.querySelector('#overlays');
    var ccStatus = overlays.querySelector('#cc-status');
    // Already tagged
    if (ccStatus && ccStatus.lang != ccLang) {
      ccStatus.remove();
      console.log(ccStatus);
    }

    hasSubtitle(url, lang, hasSubtitle => {
      if (hasSubtitle) {
        ccStatus = document.createElement('div');
        ccStatus.id = 'cc-status';
        ccStatus.style.display = 'inline-block';
        ccStatus.overlayStyle = 'DEFAULT';
        ccStatus.className = 'style-scope ytd-thumbnail';
        ccStatus.style.top = 0;
        ccStatus.style.left = 0;
        ccStatus.style.right = 'auto';
        ccStatus.style.backgroundColor = ccColor1;
        ccStatus.style.color = ccColor2;
        ccStatus.style.margin = '4px';
        ccStatus.style.padding = '3px 4px';
        ccStatus.style.fontSize = '1.2rem';
        ccStatus.style.fontWeight = '500';
        ccStatus.style.position = 'absolute';
        ccStatus.style.borderRadius = '2px';
        ccStatus.lang = ccLang;

        var span = document.createElement('span');
        span.className = 'style-scope ytd-thumbnail-overlay-time-status-renderer';
        span.ariaLabel = ccLang.toUpperCase()+' CC';
        span.textContent = ccLang.toUpperCase()+' CC';
        ccStatus.appendChild(span);

        // User moved the page in processing
        if(e.href != url && ccStatus) ccStatus.remove();

        // To avoid deleting the elements
        function waitLoadingAndAppendElement() {
        
          if (overlays.childElementCount >= 2) {
            overlays.insertBefore(ccStatus, overlays.lastChild);
            return;
          }
        
          wlTimeoutId = setTimeout(function() {
            waitLoadingAndAppendElement();
          }, 100);
        }
        
        waitLoadingAndAppendElement();
      }
    });
  }
}

function hasSubtitle(videoUrl, lang, callback) {
  // URL example : /watch?v=[video_id]
  var videoId = videoUrl.match(/\?v=([\w-]+)/)[1];
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == this.LOADING) {
      if (this.status == 200) {
        callback(true);
        this.abort();
      }else if (this.status == 404){
        callback(false);
      }
    }
  };
  request.open("GET", "https://video.google.com/timedtext?lang="+lang+"&v="+videoId, true);
  request.send(null);
}

function checkNodes(nodes) {
  nodes.forEach(node => {
    // is not http element
    if (['#text', '#comment'].includes(node.nodeName)) return;

    node.querySelectorAll('a#thumbnail').forEach(e => {
      checkNode(e);
    });
  })
}

function checkNode(node) {
  if (node.tagName != 'A' || node.id != 'thumbnail') {
    // if (node.id == 'video-title') console.log(node);
    return;
  }
  // except play list
  if (node.parentElement.tagName == 'YTD-PLAYLIST-THUMBNAIL') return;
  // console.log(node);
  addVideo(node);
}

function addVideo(video) {
  tagVideo(video, ccLang);
}

function checkAllNode() {
  var contentElement = document.querySelector("ytd-page-manager#page-manager");
  if(!contentElement) {
    return false;
  }

  checkNodes(Array.from(contentElement.children));
}

function initObserver() {
  if (!('MutationObserver' in window)) {
    return false;
  }

  var contentElement = document.querySelector("ytd-page-manager#page-manager");
  if(!contentElement) {
    return false;
  }

  checkNodes(Array.from(contentElement.children));

  mainObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      checkNode(mutation.target);
    })
  });
  mainObserver.observe(contentElement, {subtree: true, attributeFilter: ['href']});

  clearTimeout(timeoutId); // Just for good measure

  return true;
}

var timeoutId;

function initTimeout() {
  clearTimeout(timeoutId);

  if (initObserver()) {
    return;
  }

  timeoutId = setTimeout(function() {
    //TODO
    initTimeout();
  }, 2000);
}

// option update handlers
chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
  if(req['YT-SUBTITLE-FILTER_lang']) setCCLang(req['YT-SUBTITLE-FILTER_lang']);
  if(req['YT-SUBTITLE-FILTER_color1']) setCCColor1(req['YT-SUBTITLE-FILTER_color1']);
  if(req['YT-SUBTITLE-FILTER_color2']) setCCColor2(req['YT-SUBTITLE-FILTER_color2']);
});

// Load data
chrome.storage.sync.get(['YT-SUBTITLE-FILTER_lang', 'YT-SUBTITLE-FILTER_color1', 'YT-SUBTITLE-FILTER_color2'], (items) => {
  setCCLang(items['YT-SUBTITLE-FILTER_lang'] || 'en');
  setCCColor1(items['YT-SUBTITLE-FILTER_color1'] || '#008000');
  setCCColor2(items['YT-SUBTITLE-FILTER_color2'] || '#ffffff');

  initTimeout();
});