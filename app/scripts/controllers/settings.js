'use strict';

angular.module('subtome')
.controller('SettingsController', ['$scope', 'services', function SettingsController($scope, services) {
  $scope.services = services;
  $scope.remove = function removeService(service) {
    $scope.services.removeService(service.name);
  };
}]);
