'use strict';

angular.module('subtome')
.directive('followOn', ['$window', function($window) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attrs) {
      if($attrs.followOn) {
        $element.bind($attrs.followOn, function(evt) {
          var z = $window.document.createElement('script');
          if(evt) {
            $window.document.subtomeBtn = evt.target;
          }
          z.src = '/load.js';
          $window.document.body.appendChild(z);
        });
      }
    }
  };
}]);



