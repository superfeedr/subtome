'use strict';

angular.module('subtome')
.controller('ExportController', ['$window', 'subscriptions', function ExportController($window, subscriptions) {
  var opml = subscriptions.opml();
  $window.location = 'data:application/xml;base64,' + window.btoa(opml);
}]);

