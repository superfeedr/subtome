'use strict';

angular.module('subtome')
.controller('ImportController', ['$scope', '$routeParams', '$timeout', 'opmlParser', 'fileReader', function ImportController($scope, $routeParams, $timeout, opmlParser, fileReader) {
  $scope.subscriptions = [];

  function onFileRead(content) {
    $scope.subscriptions = opmlParser(content);
  }

  function onFileFailed() {
    $scope.error = 'Error reading your OPML file. Make sure it\'s valid.';
  }

  $scope.$watch('file', function() {
    if($scope.file) {
      fileReader($scope.file, onFileRead, onFileFailed);
      $timeout(function() {
        $scope.$apply();
      });
    }
  });

  if($routeParams.opml) {
    $scope.subscriptions = opmlParser(atob($routeParams.opml));
  }
}]);
