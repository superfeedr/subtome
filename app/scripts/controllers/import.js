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
    try {
      var xml = atob($routeParams.opml);
      try {
        $scope.subscriptions = opmlParser(xml);
      }
      catch(error) {
        console.error('We could not parse opml content from argument', xml);
        $scope.subscriptions = [];
      }
    }
    catch(error) {
      console.error('We could not convert argument from binary', $routeParams.opml);
      $scope.subscriptions = [];
    }
  }
}]);
