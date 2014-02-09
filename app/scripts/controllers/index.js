'use strict';

angular.module('subtome')
.controller('IndexController', ['$scope', '$i18next', function IndexController($scope, $i18next) {
  $scope.over = function over() {
    document.getElementById('demo').innerHTML = $i18next('Follow our Blog');
  };
  $scope.left = function left() {
    document.getElementById('demo').innerHTML = $i18next('See it in Action');
  };
}]);
