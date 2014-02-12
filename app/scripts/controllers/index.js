'use strict';

angular.module('subtome')
.controller('IndexController', ['$scope', '$i18next', function IndexController($scope, $i18next) {
  $scope.button = $i18next('See it in Action');
  $scope.over = function over() {
    $scope.button = $i18next('Follow our Blog');
  };
  $scope.left = function left() {
    $scope.button = $i18next('See it in Action');
  };
}]);
