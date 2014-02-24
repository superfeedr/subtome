'use strict';

angular.module('subtome')
.directive('serviceButton', [function() {
  return {
    restrict: 'E',
    templateUrl: '/views/service-button.html',
    replace:true
  };
}]);
