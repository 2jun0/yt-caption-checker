var videoObserverList = [];
var timeoutId;
var spanStyleText;

function tagVideo(e, lang) {
  var url = e.href;
  
  if (url) {
    var overlays = e.querySelector('#overlays');
    var ccStatus = overlays.querySelector('#cc-status');

    hasSubtitle(url, lang, hasSubtitle => {
      if (hasSubtitle) {
        // Already tagged
        if (ccStatus) {
          return;
        }
        ccStatus = document.createElement('div');
        ccStatus.id = 'cc-status';
        ccStatus.style.display = 'inline-block';
        ccStatus.overlayStyle = 'DEFAULT';
        ccStatus.className = 'style-scope ytd-thumbnail';
        ccStatus.style.top = 0;
        ccStatus.style.left = 0;
        ccStatus.style.right = 'auto';
        ccStatus.style.backgroundColor = 'green';
        ccStatus.style.color = '#fff';
        ccStatus.style.margin = '4px';
        ccStatus.style.padding = '3px 4px';
        ccStatus.style.fontSize = '1.2rem';
        ccStatus.style.fontWeight = '500';
        ccStatus.style.position = 'absolute';
        ccStatus.style.borderRadius = '2px';

        var span = document.createElement('span');
        span.className = 'style-scope ytd-thumbnail-overlay-time-status-renderer';
        span.ariaLabel = lang.toUpperCase()+' CC';
        span.textContent = lang.toUpperCase()+' CC';
        ccStatus.appendChild(span);

        // User moved the page in processing
        if(e.href != url && ccStatus) ccStatus.remove();

        // To avoid deleting the elements
        function waitLoadingAndAppendElement() {
        
          if (overlays.childElementCount >= 3) {
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
  tagVideo(video, 'ko');
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

  (new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      checkNode(mutation.target);
    })
  })).observe(contentElement, {subtree: true, attributeFilter: ['href']});

  clearTimeout(timeoutId); // Just for good measure

  return true;
}

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

initTimeout();