'use strict';

angular.module('subtome')
.directive('browserSpecific', ['$window', function($window) {
  return {
    link: function($scope, $element, $attrs) {
      var showed = false;
      if($attrs.browserSpecific) {
        $attrs.browserSpecific.split(' ').forEach(function(c) {
          if($window.navigator.userAgent.toLowerCase().indexOf(c) >= 0) {
            showed = true;
          }
        });
      }
      if(showed) {
        $element.show();
      }
      else {
        $element.hide();
      }
    }
  };
}]);
