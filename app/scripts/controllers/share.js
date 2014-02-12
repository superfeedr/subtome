'use strict';

angular.module('subtome')
.controller('ShareController', ['$window', '$scope', '$routeParams',  'subscriptions', function ShareController($window, $scope, $routeParams, subscriptions) {

  $scope.url = $routeParams.url;
  var a = angular.element('<a>', { href:$scope.url } )[0];
  $scope.urlRoot = a.protocol + '//' + a.hostname ;
  if(a.port && a.port > 0) {
    $scope.urlRoot += ':' + a.port;
  }
  $scope.urlRoot += '/';
  var opml = subscriptions.opml();
  $scope.share = function() {
    $window.location = $routeParams.url.replace('{subscriptions}', btoa(opml));
  };
  $scope.deny = function() {
    $window.location = '/#/subscriptions';
  };
}]);
