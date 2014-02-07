'use strict';

angular.module('subtome')
.controller("StoreController", ['$scope', 'services', 'store', function StoreController($scope, services, store) {
  store.forEach(function(a) {
    a.installed = services.uses(a.name);
  });
  $scope.apps = store;
  $scope.services = services;

  $scope.install = function installApp(app) {
    app.installed = true;
    services.register(app.registration.name, app.registration.url)
  };

  $scope.remove = function removeApp(app) {
    app.installed = false;
    services.removeService(app.registration.name);
  };
}]);
