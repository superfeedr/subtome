'use strict';

angular.module('subtome')
.controller('SubscribeController', ['$window', '$scope', '$routeParams', '$i18next', 'services', 'subscriptions', 'store', 'safeUrl', function SubscribeController($window, $scope, $routeParams, $i18next, services, subscriptions, store, safeUrl) {
  $scope.picker = 'default';
  $scope.subscriptions = subscriptions;

  // Init the modal
  angular.element('#subtomeModal').modal({
    backdrop: true,
    keyboard: true,
    show: true,
    replace: true,
    modalOverflow: true
  });

  // When the modal is hidden
  angular.element('#subtomeModal').on('hidden', function() {
    if($routeParams.back && safeUrl($routeParams.back)) {
      $window.location = $routeParams.back;
    }
    else {
      $window.location = '/done.html';
    }
  });

  // Extract the publisher suggested data
  $scope.resource = $routeParams.resource;
  if($routeParams.suggestedUrl && $routeParams.suggestedName) {
    $scope.suggested = [{
      url: $routeParams.suggestedUrl,
      name: $routeParams.suggestedName
    }];
  }

  // Extract the feeds information
  $scope.feeds = [];
  if($routeParams.feeds && $routeParams.feeds.length > 0) {
    $scope.feeds = $routeParams.feeds.split(',').map(function(url) {
      return decodeURIComponent(url);
    });
  }

  // UI, switch between store and default
  $scope.toggleButton = $i18next('View the full list of services');
  $scope.toggleStore = function toggleStore() {
    $scope.picker = $scope.picker === 'store' && 'default' || 'store';
    if($scope.picker === 'store') {
      $scope.toggleButton = $i18next('Preferred services');
    }
    else {
      $scope.toggleButton = $i18next('View the full list of services');
    }
  };

  // List of apps from the store.
  var apps = store;
  apps.forEach(function(a) {
    a.name = a.registration.name; // Compatibility
    a.url = a.registration.url; // Compatibility
  });
  $scope.apps = apps;

  // Show the popular options
  $scope.services = services;
  $scope.showPopular = !services.count();
}]);
