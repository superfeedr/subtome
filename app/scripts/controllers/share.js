'use strict';

angular.module('subtome')
.controller("ShareController", ['$scope', '$routeParams', function ShareController($scope, $routeParams) {

  $scope.url = $routeParams.url;
  var a = $('<a>', { href:$scope.url } )[0];
  $scope.urlRoot = a.protocol + '//' + a.hostname ;
  if(a.port)
    $scope.urlRoot += ':' + a.port
  $scope.urlRoot += '/';
  var opml = new Subscriptions().opml();
  $scope.share = function() {
    window.location = $routeParams.url.replace('{subscriptions}', btoa(opml));
  }
  $scope.deny = function() {
    window.location = '/#/subscriptions';
  }
}]);
