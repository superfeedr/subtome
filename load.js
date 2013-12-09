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

    /* Actual SubToMe Code */

    var feeds = [], resource = window.location.toString();

    /* From Data attributes */
    if(document.subtomeBtn && document.subtomeBtn.dataset) {
      resource = document.subtomeBtn.dataset.subtomeResource || resource;
      feeds = document.subtomeBtn.dataset.subtomeFeeds.split(',').map(function(r) {
        return decodeURIComponent(r);
      });
      window.subtome = window.subtome || {};
      window.subtome.suggestedUrl = document.subtomeBtn.dataset.subtomeSuggestedServiceUrl;
      window.subtome.suggestedName = document.subtomeBtn.dataset.subtomeSuggestedServiceName;
    }

    /* From the HTML discovery */
    if(feeds.length == 0) {
      var links = document.getElementsByTagName('link');
      for(var i = 0; i < links.length; i++) {
        if(links[i].rel) {
          var rels = links[i].rel.split(' ');
          if(rels.indexOf('alternate') >= 0 &&
             rels.indexOf('stylesheet') == -1 &&
             ['application/wiki', 'application/json', 'application/activitystream+json'].indexOf(links[i].type) == -1 )  {
            if(links[i].href && links[i].href.length > 0) {
              feeds.push(encodeURIComponent(links[i].href));
            }
          }
        }
      }
    }

    var s = document.createElement('iframe');
    var src = 'https://www.subtome.com';
    src += '/#/subscribe?resource=' + encodeURIComponent(resource) + '&feeds=' + encodeURIComponent(feeds.join(','));
    if(window.subtome && window.subtome.suggestedUrl && window.subtome.suggestedName) {
      src += '&suggestedUrl=' + encodeURIComponent(window.subtome.suggestedUrl) + '&suggestedName=' + encodeURIComponent(window.subtome.suggestedName)
    }
    s.setAttribute('style','display:block; position:fixed; top:0px; left:0px; width:100%; height:100%; border:0px; background: transparent; z-index: 2147483647');
    s.setAttribute('src', src);
    var loaded = false;
    s.onload = function() {
      if(loaded) {
        document.getElementsByTagName('body')[0].removeChild(s);
      }
      loaded = true;
    }
    document.getElementsByTagName('body')[0].appendChild(s);
    window.addEventListener("message", function(event) {
      if (event.origin !== "https://www.subtome.com")
        return;

      var _gaq = window._gaq || [];
      _gaq.push(['_trackEvent', 'subtome', 'follow', event.data.subscription.app.name]);
    });

  })();

