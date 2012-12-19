var services = require('./services');
var relativeDate = require('relative-date');
var urlParser = require('url');

function addService(name, handler) {
  $('#defaultMsg').hide();
  var s = '<tr>';
  s += '<td><a href="' +  urlParser.resolve(handler.url,'/').toString() + '">' + name + '</a></td>';
  s += '<td>' + relativeDate(new Date(handler.addedOn)) + '</td>';
  // if(handler.default)
  //   s += '<td>' + '<input type="radio" name="defaultRadios" checked>' + '</td>';
  // else
  //   s += '<td>' + '<input type="radio" name="defaultRadios">' + '</td>';

  s += '<td>' + '<button type="button" class="btn btn-mini test">Test</button>' + '</td>';
  s += '<td>' + '<button type="button" class="btn btn-mini btn-danger remove">Remove</button>' + '</td>';
  s += '</tr>';
  var line = $(s);
  line.find('button.remove').click(function() {
    services.removeService(name);
    line.remove();
  });
  // line.find('input').click(function(evt) {
  //   services.setAsDefault(name, line.find('input').is(':checked'));
  // });
  line.find('button.test').click(function() {
    var redirect = handler.url.replace('{url}', 'http://blog.superfeedr.com/atom.xml');
    services.register(name, handler.url);
    window.open(redirect);
  })
  $('#services').append(line);
}

$(document).ready(function() {

  $('#noDefault').click(function() {
    services.setAsDefault();
  });

  $('#pickSuggestions').click(function() {
    $('#suggestionsModal').modal({backdrop: true, keyboard: true, show: true});
    $('#suggestionsModalBody button').remove();
    services.forEachDefaultService(function(service, handler) {
      var button = $('<button class="btn" style="display:block; width:200px; margin:10px">Use ' + service + '</button>');
      button.click(function() {
        services.register(service, handler.url);
        button.addClass('disabled');
      });
      $('#suggestionsModalBody').append(button);
    });
  });

  $('#suggestionsModal').on('hidden', function() {
    services.forEach(addService);
  });

  $('#registerProtocolHandler').click(function() {
    var res = navigator.registerProtocolHandler("web+subscribe", 'http://www.subtome.com/subscribe.html?resource=%s', "Subtome");
  });

  if(navigator.registerProtocolHandler) {
    $('#protocolHandlerRegistration').show();
  }

  services.forEach(addService);
});

