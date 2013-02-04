(function() {
  var proto = 'https'
  if (window.location.protocol != "https:")
    proto = 'http'

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
  s.setAttribute('style','position:absolute;top:0px; left:0px; width:100%; height:100%; border:0px; background: transparent; z-index: 2147483647');
  s.setAttribute('src', proto + '://s3.amazonaws.com/www.subtome.com/subscribe.html?resource=' + encodeURIComponent(resource) + '&feeds=' + feeds.join(','));
  var loaded = false;
  s.onload = function() {
    if(loaded) {
      document.getElementsByTagName('body')[0].removeChild(s);
    }
    loaded = true;
  }
  document.getElementsByTagName('body')[0].appendChild(s);
})();

