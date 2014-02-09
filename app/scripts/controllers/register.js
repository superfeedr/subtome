'use strict';

angular.module('subtome')
.controller('RegisterController', ['$scope', '$routeParams', 'ga', function RegisterController($scope, $routeParams, ga) {
  ga('send', 'event', 'services', 'register', $routeParams.name);
  $scope.services.register($routeParams.name, $routeParams.url);
  $scope.service = {name: $routeParams.name, url: $routeParams.url};
}]);
