'use strict';

angular.module('subtome')
.controller("ImportController", ['$scope', '$routeParams', function ImportController($scope, $routeParams) {
  $scope.subscriptions = [];

  function parseFile(contents) {
    var parser = new DOMParser();
    var opml = parser.parseFromString(contents, "text/xml");
    var outlines = opml.getElementsByTagName('outline');
    var subscriptions = [];
    for(var i=0; i<outlines.length; i++) {
      subscriptions.push({feed: outlines[i].getAttribute('xmlUrl'), title: outlines[i].getAttribute('title') || outlines[i].getAttribute('text'), html: outlines[i].getAttribute('htmlUrl')});
    }
    return subscriptions;
  }

  $scope.$watch('file', function() {
    if($scope.file) {
      var reader = new FileReader();
      reader.readAsText($scope.file, "UTF-8");
      reader.onload = function (evt) {
        $scope.subscriptions = parseFile(evt.target.result);
        $scope.$apply();
      }
      reader.onerror = function (evt) {
        $scope.error = "Error reading your OPML file. Make sure it's valid.";
        $scope.$apply();
      }
    }
  });

  if($routeParams.opml) {
    $scope.subscriptions = parseFile(atob($routeParams.opml));
  }
}]);
