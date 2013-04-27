require('./compatibility.js');
var services = require('./services');
var relativeDate = require('relative-date');
var urlParser = require('url');

function addService(name, handler) {
  $('#defaultMsg').hide();
  var s = '<tr>';
  s += '<td><a href="' +  urlParser.resolve(handler.url,'/').toString() + '">' + name + '</a></td>';
  s += '<td>' + relativeDate(new Date(handler.addedOn)) + '</td>';
  s += '<td>' + '<button type="button" style="float: right;" class="btn btn-mini btn-danger remove">Remove</button>' + '</td>';
  s += '</tr>';
  var line = $(s);
  line.find('button.remove').click(function() {
    services.removeService(name);
    line.remove();
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

  $('.browser-specific').each(function(i, b) {
    var browserSpecific = $(b).attr('class');
    if(typeof(browserSpecific) == 'string') {
      browserSpecific.split(' ').forEach(function(c) {
        if(navigator.userAgent.toLowerCase().indexOf(c) >= 0) {
          $(b).show();
        }
        else {
          $(b).hide();
        }
      });
    }
  });
});

