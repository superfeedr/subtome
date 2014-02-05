'use strict';

angular.module('subtome')
.controller("SubscribeController", ['$scope', '$routeParams', 'ga', function SubscribeController($scope, $routeParams, ga) {
  $scope.picker = "default";
  $scope.subscriptions = new Subscriptions();

  // Init the modal
  $('#subtomeModal').modal({
    backdrop: true,
    keyboard: true,
    show: true,
    replace: true,
    modalOverflow: true
  });

  // When the modal is hidden
  $('#subtomeModal').on('hidden', function() {
    if($routeParams.back && safeUrl($routeParams.back)) {
      window.location = $routeParams.back;
    }
    else {
      window.location = '/done.html';
    }
  });

  // Extract the publisher suggested data
  $scope.resource = $routeParams.resource;
  if($routeParams.suggestedUrl && $routeParams.suggestedName) {
    $scope.suggested = {
      url: $routeParams.suggestedUrl,
      name: $routeParams.suggestedName
    };
  }

  // Keep track of the click on the button
  ga('send', 'event', 'resources', 'subscribe', $scope.resource)

  // Extract the feeds information
  $scope.feeds = [];
  if($routeParams.feeds && $routeParams.feeds.length > 0) {
    $scope.feeds = $routeParams.feeds.split(",").map(function(url) {
      return decodeURIComponent(url);
    });
    ga('send', 'event', 'feeds', 'subscribe', $scope.feeds[0])
  }

  // UI, switch between store and default
  $scope.toggleButton = i18n.t("View the full list of services");
  $scope.toggleStore = function toggleStore() {
    $scope.picker = $scope.picker == "store" && "default" || "store";
    if($scope.picker == "store") {
      $scope.toggleButton = i18n.t("Preferred services");
    }
    else {
      $scope.toggleButton = i18n.t("View the full list of services");
    }
  }

  // When a button is clicked.
  $scope.openService = function openService(service) {
    ga('send', 'event', 'services', 'redirect', service.name);
    var url = service.url;
    if(safeUrl(url)) {
      var redirect = decodeURIComponent(url).replace('{url}', encodeURIComponent($scope.resource));
      if(redirect.match(/\{feed\}/)) {
        if($scope.feeds[0]) {
          redirect = redirect.replace('{feed}', encodeURIComponent($scope.feeds[0]));
        }
        else {
          redirect = redirect.replace('{feed}', encodeURIComponent($scope.resource));
        }
      }
      if(redirect.match(/\{feeds\}/)) {
        redirect = redirect.replace('{feeds}', $scope.feeds.join(','));
      }
      $scope.subscriptions.add($scope.resource, {feeds: $scope.feeds, service: service.name});
      var d = document.createElement('a');
      d.href = $scope.resource;
      var s = document.createElement('a');
      s.href = url;
      window.parent.postMessage({subscription: {
        feeds: $scope.feeds,
        resource: $scope.resource,
        app: {
          name: service.name,
          url: s.protocol + '//' + s.host
        }
      }}, d.protocol + '//' + d.host);
      window.open(redirect);
    }
    else {
      alert("It looks like this redirect is not safe. Please remove that service from your favorites.");
    }
  }

  // List of apps from the store.
  var apps = appStore;
  apps.forEach(function(a) {
    a.name = a.registration.name; // Compatibility
    a.url = a.registration.url; // Compatibility
  });
  $scope.apps = apps;

  // Toggle button
  $scope.toggle = function toggleApp(app) {
    if($scope.services.uses(app.name)) {
      $scope.services.removeService(app.name);
    }
    else {
      $scope.services.register(app.name, app.url)
    }
  };

  // Show the popular options
  $scope.showPopular = !$scope.services.count();
}]);
