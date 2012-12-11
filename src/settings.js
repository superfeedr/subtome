var services = require('./services');
var relativeDate = require('relative-date');
var urlParser = require('url');

function addService(name, handler) {
  var s = '<tr>';
  s += '<td><a href="' +  urlParser.resolve(handler.url,'/').toString() + '">' + name + '</a></td>';
  s += '<td>' + relativeDate(new Date(handler.addedOn)) + '</td>';
  if(handler.default)
    s += '<td>' + '<input type="radio" name="defaultRadios" checked>' + '</td>';
  else
    s += '<td>' + '<input type="radio" name="defaultRadios">' + '</td>';

  s += '<td>' + '<button type="button" class="btn btn-mini test">Test</button>' + '</td>';
  s += '<td>' + '<button type="button" class="btn btn-mini btn-danger remove">Remove</button>' + '</td>';
  s += '</tr>';
  var line = $(s);
  line.find('button.remove').click(function() {
    services.removeService(name);
    line.remove();
  });
  line.find('input').click(function(evt) {
    services.setAsDefault(name, line.find('input').is(':checked'));
  });
  line.find('button.test').click(function() {
    var redirect = handler.url.replace('{url}', 'http://blog.superfeedr.com/atom.xml');
    services.register(name, handler.url);
    window.open(redirect);
  })
  $('#services').append(line);
}

$(document).ready(function() {
  services.forEach(addService);
  $('#noDefault').click(function() {
    services.setAsDefault();
  })
});

