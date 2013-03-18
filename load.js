window.SubToMe = (function() {
  var getURLPart = function (url, part) {
    var e = document.createElement('a');
    getURLPart = function (url, part) {
      e.href = url;
      return e[part];
    };
    return getURLPart(url, part);
  };

  var supportedHosts = ['www.subtome.com'];
  var supportedParams = ['resource', 'feed'];
  var scriptParams = {};
  var scriptTag = document.querySelectorAll('script[src*="/load.js"]');
  var scriptHash;
  var i = 0;
  var length = scriptTag.length;
  for (; i < length; i++) {
    if (supportedHosts.indexOf(getURLPart(scriptTag[i].src, 'host')) !== -1) {
      scriptHash = getURLPart(scriptTag[i].src, 'hash');
      break;
    }
  }
  scriptHash = scriptHash ? scriptHash.substr(1).split('&') : [];

  for (var j = 0, jLength = scriptHash.length; j < jLength; j++) {
    scriptHash[j] = scriptHash[j].split('=', 2);
    if (scriptHash[j][0] !== '') {
      scriptParams[decodeURIComponent(scriptHash[j][0])] = scriptHash[j][1] ? decodeURIComponent(scriptHash[j][1]) : null;
    }
  }

  var showSubscribeFrame = function (params) {
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

    if (params.feed) {
      params.feed = encodeURIComponent(getURLPart(params.feed, 'href'));
      var feedPosition = feeds.indexOf(params.feed);
      if (feedPosition !== -1) {
        feeds.splice(feedPosition, 1);
      }
      feeds.unshift(params.feed);
    }

    var s = document.createElement('iframe');
    var url = window.location.toString();
    var resource = params.resource ? encodeURIComponent(getURLPart(params.resource, 'href')) : window.location.toString();
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
  }

  if (scriptParams.standalone === undefined) {
    showSubscribeFrame(scriptParams);
  } else {
    var buttons = document.querySelectorAll('button.subtome,input.subtome,a.subtome');
    for (i = 0, length = buttons.length; i < length; i++) {
      buttons[i].onclick = function () {
        params = {};
        for (i = 0, length = supportedParams.length; i < length; i++) {
          params[supportedParams[i]] = this.getAttribute('data-' + supportedParams[i]) || scriptParams[supportedParams[i]] || undefined;
        }
        showSubscribeFrame(params);
        return false;
      };
    }
  }

  return {
    showSubscribeFrame : showSubscribeFrame
  };
})();

