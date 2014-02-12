'use strict';

angular.module('subtome')
.directive('filePicker', function(){
  return {
    link: function($scope, $element){
      $element.on('change', function() {
        $scope.file = $element[0].files[0];
        $scope.$apply();
      });
    }
  };
});
