var videoObserverList = [];
var timeoutId;
var spanStyleText;

function tagVideo(e, lang) {
  var url = e.href;
  
  if (url) {
    var overlays = e.querySelector('#overlays');
    var ccStatus = overlays.querySelector('#cc-status');

    if (ccStatus) ccStatus.style.display = 'none';

    getSubtitle(url, lang, hasSubtitle => {
      if (hasSubtitle) {
        // Already tagged
        if (ccStatus) {
          ccStatus.style.display = 'inline-block';
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
        overlays.appendChild(ccStatus);

        var span = document.createElement('span');
        span.className = 'style-scope ytd-thumbnail-overlay-time-status-renderer';
        span.ariaLabel = lang.toUpperCase()+' CC';
        span.textContent = lang.toUpperCase()+' CC';
        ccStatus.appendChild(span);

        // User moved the page in processing
        // if(e.href != url && ccStatus) ccStatus.remove();

      }else if (ccStatus) {
        // Untag
        // ccStatus.remove();
      }
    });
  }
}

function untagAllVideo() {
  document.querySelectorAll('#ccStatus').forEach(e => {e.remove();});
}

function getSubtitle(videoUrl, lang, callback) {
  // URL example : /watch?v=[video_id]
  var videoId = videoUrl.match(/\?v=([\w-]+)/)[1];

  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == this.DONE) {
      if (this.status == 200) {
        callback(this.responseText);
      }else if (this.status == 404){
        callback(undefined);
      }
    }
  };
  request.open("POST", "https://video.google.com/timedtext?lang="+lang+"&v="+videoId, true);
  request.send();
}

function tagVideos(thumbs) {
  thumbs.forEach(thumb => {
    tagVideo(thumb, 'ko');
  })
}

function checkNodes(nodes) {
  nodes.forEach(node => {
    // is not http element
    if (['#text', '#comment'].includes(node.nodeName)) return;

    node.querySelectorAll('a#thumbnail').forEach(e => {
      addVideo(e);
    });
  })
}

function addVideo(video) {
  tagVideo(video, 'ko');

  var observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      tagVideo(mutation.target, 'ko');
    })
  });

  observer.observe(video, { attributes: true })
  videoObserverList.push(observer);
}

function initObserver() {
  if (!('MutationObserver' in window)) {
    return false;
  }

  var contentElement = document.querySelector("ytd-browse[role='main']");
  if(!contentElement) {
    return false;
  }

  checkNodes(Array.from(contentElement.children));

  (new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      // console.log(mutation.type, mutation.attributeName, mutation.target.tagName, mutation.target)
      checkNodes(mutation.addedNodes);
    })
  })).observe(contentElement, { childList: true, subtree: true });

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