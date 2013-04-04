require('./compatibility.js');
var urlParser = require('url');
var qsParser = require('querystring');
var services = require('./services');

var url = urlParser.parse(window.location.href);
var qs = qsParser.parse(url.query);

function addService(name, handler) {
  var button = $('<button class="btn" style="display: block; margin: 10px; width:200px">' + name.replace(/(<([^>]+)>)/ig,'') + '</button>')
  button.click(function() {
    services.register(name, handler.url);
    var feeds = [];
    if(qs.feeds) {
      feeds = qs.feeds.split(',');
    }
    var redirect = handler.url.replace('{url}', encodeURIComponent(qs.resource));
    if(redirect.match(/\{feed\}/)) {
      if(feeds[0]) {
        redirect = redirect.replace('{feed}', encodeURIComponent(feeds[0]))
      }
      else {
        redirect = redirect.replace('{feed}', encodeURIComponent(qs.resource))
      }
    }
    if(redirect.match(/\{feeds\}/)) {
      redirect = redirect.replace('{feeds}', feeds.join(','));
    }
    if(typeof(_gaq) != 'undefined') {
      _gaq.push(['_trackEvent', 'Services', 'Subscribe', name, name]);
    }

    window.open(redirect);
    window.location = '/done.html';
  });
  $('#subtomeModalBody').append(button);
}

$(document).ready(function() {
  var servicesUsed = 0;
  $('#subtomeModal').modal({backdrop: true, keyboard: true, show: true});

  if(services.error) {
    $('#subtomeModalBody').append($('<p class="alert alert-error">' + services.error + '</p>'));
  }

  services.forEach(function(service, handler) {
    servicesUsed += 1;
    addService(service, handler);
  });
  if(servicesUsed == 0) {
    $('#subtomeModalBody').append($('<h4>Suggested Services</h4>'));
    services.forEachDefaultService(function(service, handler) {
      if(!services.uses(service)) {
        addService(service, handler);
      }
    });
  }

  $('#settingsButton').click(function() {
    window.open('https://www.subtome.com/settings.html');
    window.location = '/done.html';
  });

  $('#subtomeModal').on('hidden', function() {
    window.location = '/done.html';
  });
});

