'use strict';

angular.module('subtome')
.controller('SettingsController', ['$scope', 'services', function SettingsController($scope, services) {
  $scope.services = services;
  $scope.remove = function removeService(service) {
    services.removeService(service.name);
  };
}]);
