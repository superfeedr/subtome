'use strict';

angular.module('subtome')
.controller("RedirectController", ['$routeParams', '$scope', function RedirectController($routeParams, $scope) {
  $scope.info = 'Redirecting you to the feed...';
  if(!$routeParams.to)
    return window.location = '/';
  var destination = decodeURIComponent($routeParams.to);
  if(!safeUrl(destination)) {
    return $scope.info = 'We could not achieve a redirect because this URL ' + destination + ' is not safe.';
  }
  if(history && history.pushState)
    history.pushState({}, "SubToMe: Subscribe", "/#/subscribe?resource=" + destination + "&feeds=" + destination + "");
  window.location = destination;
}]);
