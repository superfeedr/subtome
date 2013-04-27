require('./compatibility.js');
var urlParser = require('url');
var qsParser = require('querystring');
var services = require('./services');

function addService(name, handler, resource, feeds) {
  var button = $('<button class="btn" style="display: block; margin: 10px; width:200px">' + name.replace(/(<([^>]+)>)/ig,'') + '</button>')
  button.click(function() {

    services.register(name, handler.url);
    var redirect = handler.url.replace('{url}', encodeURIComponent(resource));
    if(redirect.match(/\{feed\}/)) {
      if(feeds[0]) {
        redirect = redirect.replace('{feed}', encodeURIComponent(feeds[0]))
      }
      else {
        redirect = redirect.replace('{feed}', encodeURIComponent(resource))
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
  var url = urlParser.parse(window.location.href);
  var qs = qsParser.parse(url.query);
  var feeds = [];
  var resource = qs.resource;
  if(qs.feeds) {
    feeds = qs.feeds.split(',');
  }
  var servicesUsed = 0;
  $('#subtomeModal').modal({backdrop: true, keyboard: true, show: true});

  if(services.error) {
    $('#subtomeModalBody').append($('<p class="alert alert-error">' + services.error + '</p>'));
  }

  var countServices = services.count();
  if(countServices == 0) {
    $('#subtomeModalBody').append($('<p>You do not have selected your prefered services yet. Please, <a target="_blank" href="/store.html">pick one</a>!</p>'));
  }
  else {
    $('#subtomeModalBody').append($('<p>Pick a service to subscribe to this page:</p>'));
    services.forEach(function(service, handler) {
      addService(service, handler, resource, feeds);
    });
  }

  $('#settingsButton').click(function() {
    window.open('https://www.subtome.com/settings.html');
    window.location = '/done.html';
  });

  $('#subtomeModal').on('hidden', function() {
    window.location = '/done.html';
  });

  if(feeds && feeds[0]) {
    $('#rssLink').show();
    $('#rssLink').attr("href", feeds[0]);
  }

});

