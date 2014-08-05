'use strict';

angular.module('subtome')
.controller('RegisterController', ['$scope', '$routeParams', 'services', function RegisterController($scope, $routeParams, services) {
  services.register($routeParams.name, $routeParams.url);
  $scope.service = {name: $routeParams.name, url: $routeParams.url};
}]);
