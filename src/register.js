var urlParser = require('url');
var qsParser = require('querystring');
var services = require('./services');

var url = urlParser.parse(window.location.href);
var qs = qsParser.parse(url.query);

services.register(qs.name, qs.url);
