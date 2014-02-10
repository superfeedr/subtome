'use strict';

angular.module('subtome')
.directive('followOn', [function() {
  return {
    restrict: 'A',
    link: function($scope, $element, $attrs) {
      if($attrs.followOn) {
        $element.bind($attrs.followOn, function(evt) {
          var z=document.createElement('script');
          if(evt) {
            document.subtomeBtn=evt.target;
          }
          z.src='/load.js';
          document.body.appendChild(z);
        });
      }
    }
  };
}]);



