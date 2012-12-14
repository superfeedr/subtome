var urlParser = require('url');
var qsParser = require('querystring');
var services = require('./services');

var url = urlParser.parse(window.location.href);
var qs = qsParser.parse(url.query);

function addService(name, handler) {
  var button = $('<button class="btn" style="display: block; margin: 10px; width:200px">' + name.replace(/(<([^>]+)>)/ig,'') + '</button>')
  button.click(function() {
    services.register(name, handler.url);
    var redirect = handler.url.replace('{url}', qs.resource);
    window.open(redirect);
    window.location = '/done.html';
  });
  $('#subtomeModalBody').append(button);
}

$(document).ready(function() {
  var servicesUsed = 0;
  $('#subtomeModal').modal({backdrop: true, keyboard: true, show: true});
  services.forEach(function(service, handler) {
    if(handler.default) {
      var redirect = handler.url.replace('{url}', qs.resource);
      window.open(redirect);
      window.location = '/done.html';
    }
    else {
      servicesUsed += 1;
      addService(service, handler);
    }
  });
  if(servicesUsed < 3) {
    $('#subtomeModalBody').append($('<h4>Suggested Services</h4>'));
    services.forEachDefaultService(function(service, handler) {
      if(!services.uses(service)) {
        addService(service, handler);
      }
    });
  }

  $('#settingsButton').click(function() {
    window.open('http://www.subtome.com/settings.html');
    window.location = '/done.html';
  });

  $('#subtomeModal').on('hidden', function() {
    window.location = '/done.html';
  });
});

