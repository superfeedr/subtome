var urlParser = require('url');
var qsParser = require('querystring');
var services = require('./services');

var url = urlParser.parse(window.location.href);
var qs = qsParser.parse(url.query);

function addService(name, handler) {
    var button = document.createElement('button');
    button.setAttribute('class', 'btn');
    button.setAttribute('style', 'display: block; margin: 10px');
    button.onclick = function() {
      services.register(name, handler.url);
      var redirect = handler.url.replace('{url}', qs.resource);
      window.open(redirect);
      window.location = '/done.html';
    };
    button.innerHTML = name.replace(/(<([^>]+)>)/ig,"");;
    $('#subtomeModalBody').append(button);
}

$(document).ready(function() {
  $('#subtomeModal').modal({backdrop: true, keyboard: true, show: true});
  services.forEach(addService);
  $('#subtomeModalBody').append($('<h4>Suggested Services</h4>'));
  services.forEachDefaultService(addService)
  $('#subtomeModal').on('hidden', function() {
    window.location = '/done.html';
  });
});

