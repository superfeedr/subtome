var proto = 'https'
if (window.location.protocol != "https:")
  proto = 'http'

var s = document.createElement('iframe');
var url = window.location.toString();
var resource = window.location.toString();
var feed = '';
s.setAttribute('style','position:absolute;top:0px; left:0px; width:100%; height:100%; border:0px; background: transparent; z-index: 2147483647');
s.setAttribute('src', proto + '://www.subtome.com/subscribe.html?resource=' + encodeURIComponent(resource)) + '&feed=' + encodeURIComponent(feed);
var loaded = false;
s.onload = function() {
  if(loaded) {
    document.getElementsByTagName('body')[0].removeChild(s);
  }
  loaded = true;
}
document.getElementsByTagName('body')[0].appendChild(s);

