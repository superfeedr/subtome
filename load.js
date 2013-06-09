(function() {

  /* IE 8 Compat. :( */
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
      "use strict";
      if (this == null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
              n = 0;
          } else if (n != 0 && n != Infinity && n != -Infinity) {
            n = (n > 0 || -1) * Math.floor(Math.abs(n));
          }
        }
        if (n >= len) {
          return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
          if (k in t && t[k] === searchElement) {
            return k;
          }
        }
        return -1;
      }
    }

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

