'use strict';

angular.module('subtome')
.controller("IndexController", ['$scope', function IndexController($scope) {
  $scope.over = function over() {
    document.getElementById('demo').innerHTML=i18n.t("Follow our Blog");
  }
  $scope.left = function left() {
    document.getElementById('demo').innerHTML=i18n.t("See it in Action");
  }
}]);
