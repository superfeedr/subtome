'use strict';

angular.module('subtome')
.controller('RegisterController', ['$scope', '$routeParams', 'services', 'ga', function RegisterController($scope, $routeParams, services, ga) {
  ga('send', 'event', 'services', 'register', $routeParams.name);
  services.register($routeParams.name, $routeParams.url);
  $scope.service = {name: $routeParams.name, url: $routeParams.url};
}]);
