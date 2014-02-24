'use strict';

angular.module('subtome')
.directive('usesService', ['$window', 'services', function($window, services) {
  return {
    restrict: 'A',
    link: function($scope, $element) {

      function setClasses() {
        $element.addClass('glyphicon');
        if(services.uses($scope.service.name)) {
          $element.removeClass('glyphicon-heart');
          $element.addClass('glyphicon-remove');
        }
        else {
          $element.removeClass('glyphicon-remove');
          $element.addClass('glyphicon-heart');
        }
      }

      $scope.toggle = function() {
        if(services.uses($scope.service.name)) {
          services.removeService($scope.service.name);
        }
        else {
          services.register($scope.service.name, $scope.service.url);
        }
        setClasses();
      };

      setClasses();
    }
  };
}]);
