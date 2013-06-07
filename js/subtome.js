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

}

function SettingsCtrl($scope, $routeParams) {

}

function PublishersCtrl($scope, $routeParams) {

}

function DevelopersCtrl($scope, $routeParams) {

}

function StoreCtrl($scope, $routeParams) {

}
