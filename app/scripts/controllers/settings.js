'use strict';

angular.module('subtome')
.controller("SettingsController", ['$scope', function SettingsController($scope) {
  $scope.showBrowserSpecifics();
  $scope.remove = function removeService(service) {
    $scope.services.removeService(service.name);
  }
}]);
