'use strict';

angular.module('subtome')
.directive('hideOnPath', ['$rootScope', '$location' , function($rootScope, $location) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attrs) {
      function showOrHide() {
        if ($location.path() !== $attrs.hideOnPath) {
          $element.show();
        }
        else {
          $element.hide();
        }
      }
      $rootScope.$on('$locationChangeSuccess', showOrHide);
    }
  };
}]);
