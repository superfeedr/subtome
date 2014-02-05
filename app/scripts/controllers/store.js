'use strict';

angular.module('subtome')
.controller("StoreController", ['$scope', function StoreController($scope) {
  var apps = appStore;
  apps.forEach(function(a) {
    a.installed = $scope.services.uses(a.name);
  });
  $scope.apps = apps;

  $scope.install = function installApp(app) {
    app.installed = true;
    $scope.services.register(app.registration.name, app.registration.url)
  };

  $scope.remove = function removeApp(app) {
    app.installed = false;
    $scope.services.removeService(app.registration.name);
  };
}]);
