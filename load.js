(function() {
  var feeds = [];
  var links = document.getElementsByTagName('link');
  for(var i = 0; i < links.length; i++) {
    if(links[i].rel) {
      if(links[i].rel.split(' ').indexOf('alternate') >= 0) {
        if(links[i].href && links[i].href.length > 0) {
          feeds.push(encodeURIComponent(links[i].href));
        }
      }
    }
  }

  var getURLPart = function (url, part) {
    var e = document.createElement('a');
    getURLPart = function (url, part) {
      e.href = url;
      return e[part];
    };
    return getURLPart(url, part);
  };

  var scriptParams = {};
  var scriptTag = document.querySelectorAll('script[src*="/load.js"]');
  var scriptHash = scriptTag.length ? getURLPart(scriptTag[scriptTag.length - 1].src, 'hash') : '';
  scriptHash = scriptHash === '' ? [] : scriptHash.substr(1).split('&');

  for (var j = 0, jLength = scriptHash.length; j < jLength; j++) {
    scriptHash[j] = scriptHash[j].split('=', 2);
    if (scriptHash[j][0] !== '') {
      scriptParams[decodeURIComponent(scriptHash[j][0])] = scriptHash[j][1] ? encodeURIComponent(getURLPart(decodeURIComponent(scriptHash[j][1]), 'href')) : null;
    }
  }

  if (scriptParams.feed) {
    var feedPosition = feeds.indexOf(scriptParams.feed);
    if (feedPosition !== -1) {
      feeds.splice(feedPosition, 1);
    }
    feeds.unshift(scriptParams.feed);
  }

  var s = document.createElement('iframe');
  var url = window.location.toString();
  var resource = window.location.toString();
  s.setAttribute('style','position:fixed;top:0px; left:0px; width:100%; height:100%; border:0px; background: transparent; z-index: 2147483647');
  s.setAttribute('src', 'https://www.subtome.com/subscribe.html?resource=' + encodeURIComponent(resource) + '&feeds=' + feeds.join(','));
  var loaded = false;
  s.onload = function() {
    if(loaded) {
      document.getElementsByTagName('body')[0].removeChild(s);
    }
    loaded = true;
  }
  document.getElementsByTagName('body')[0].appendChild(s);
})();

