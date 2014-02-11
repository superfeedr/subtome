'use strict';

angular.module('subtome')
.directive('filePicker', function(){
  return {
    link: function($scope, $element){
      $element.on('change', function() {
        console.log($element[0].files);
        $scope.file = $element[0].files[0];
        $scope.$apply();
      });
    }
  };
});
