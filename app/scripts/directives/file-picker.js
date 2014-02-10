'use strict';

angular.module('subtome')
.directive('filePicker', function(){
  return {
    link: function($scope, $linkElement){
      $linkElement.bind('change', function(event) {
        var files = event.target.files;
        $scope.file = files[0];
        $scope.$apply();
      });
    }
  };
});
