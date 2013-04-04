require('./compatibility.js');
var urlParser = require('url');
var qsParser = require('querystring');
var services = require('./services');

var url = urlParser.parse(window.location.href);
var qs = qsParser.parse(url.query);

services.register(qs.name, qs.url);
$(document).ready(function() {
  $('.serviceName').text(qs.name);
  if(typeof(_gaq) != 'undefined') {
    _gaq.push(['_trackEvent', 'Services', 'Register', qs.name, qs.name]);
  }
});
