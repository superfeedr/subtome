'use strict';

angular.module('subtome')
.controller('PublishersController', ['$window', function PublishersController($window) {
  $window.location = 'http://docs.subtome.com/publishers/';
}]);
