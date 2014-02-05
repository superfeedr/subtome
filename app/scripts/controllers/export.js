'use strict';

angular.module('subtome')
.controller("ExportController", [function ExportController() {
  var subscriptions = new Subscriptions().list();
  var opml = new Subscriptions().opml();
  window.location = "data:application/xml;base64," + window.btoa(opml);
}]);

