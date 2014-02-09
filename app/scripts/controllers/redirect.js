'use strict';

angular.module('subtome')
.controller('RedirectController', ['$window', '$routeParams', '$scope', '$location', 'safeUrl', function RedirectController($window, $routeParams, $scope, $location, safeUrl) {
  $scope.info = 'Redirecting you to the feed...';
  if(!$routeParams.to) {
    $window.location = '/';
    return ;
  }
  var destination = decodeURIComponent($routeParams.to);
  if(!safeUrl(destination)) {
    $scope.info = 'We could not achieve a redirect because this URL ' + destination + ' is not safe.';
    return ;
  }
  // TOFIX. This creates an error in the console... even though that works!
  if($window.history && $window.history.pushState) {
    $window.history.pushState({}, 'SubToMe: Subscribe', '/#/subscribe?resource=' + destination + '&feeds=' + destination + '');
  }
  $window.location = destination;
}]);
