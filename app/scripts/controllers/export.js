'use strict';

angular.module('subtome')
.controller("ExportController", ['subscriptions', function ExportController(subscriptions) {
  var opml = subscriptions.opml();
  window.location = "data:application/xml;base64," + window.btoa(opml);
}]);

