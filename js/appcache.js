window.addEventListener('load', function(e) {
  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      window.applicationCache.swapCache();
      console.log('New version loaded. Dropping language caches');
      for (var key in localStorage){
        if(key.match(/res_*/)) {
          localStorage.removeItem(key);
        }
      }
    }
  }, false);
}, false);

