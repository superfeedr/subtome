'use strict';

angular.module('subtome')
.controller("SubscriptionsController", ['$scope', function ImportController($scope) {
  $scope.subscriptions = new Subscriptions().all();
  $scope.pickColor = function pickColor(string) {
    var colors = [
      "background-color: rgb(66, 139, 202)",
      "background-color: rgb(91, 192, 222)",
      "background-color: rgb(240, 173, 78)",
      "background-color: rgb(217, 83, 79);",
      "background-color: rgb(92, 184, 92)",
    ];
    var s = 0;
    for(var k = 0; k < string.length; k++) {
      s += string.charCodeAt(k);
    }
    return colors[s % colors.length];
  }
}]);
