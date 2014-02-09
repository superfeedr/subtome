'use strict';

angular.module('subtome')
.controller('PublishersController', ['$scope', '$window', function PublishersController($scope, $window) {
  $window.location = 'http://docs.subtome.com/publishers/';
}]);
