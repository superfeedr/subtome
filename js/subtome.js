angular.module('subtome', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: 'partials/index.html',   controller: IndexCtrl}).
      when('/settings', {templateUrl: 'partials/settings.html', controller: SettingsCtrl}).
      when('/publishers', {templateUrl: 'partials/publishers.html', controller: PublishersCtrl}).
      when('/developers', {templateUrl: 'partials/developers.html', controller: DevelopersCtrl}).
      when('/store', {templateUrl: 'partials/store.html', controller: StoreCtrl}).
      otherwise({redirectTo: '/'});
}]);


function IndexCtrl($scope, $routeParams) {
// Don't load anything :)
}

function SettingsCtrl($scope, $routeParams) {
// Load the settings :)
}

function PublishersCtrl($scope, $routeParams) {
// Load the gists!
}

function DevelopersCtrl($scope, $routeParams) {
  // Load the gists!
}

function StoreCtrl($scope, $routeParams) {
  console.log("NOW WHAT?")
}
