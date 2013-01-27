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
    $("#services tr").remove();
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

