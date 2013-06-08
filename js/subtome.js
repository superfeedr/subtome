angular.module('subtome', []).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {templateUrl: 'partials/index.html',   controller: IndexController}).
    when('/settings', {templateUrl: 'partials/settings.html', controller: SettingsController}).
    when('/publishers', {templateUrl: 'partials/publishers.html', controller: PublishersController}).
    when('/developers', {templateUrl: 'partials/developers.html', controller: DevelopersController}).
    when('/store', {templateUrl: 'partials/store.html', controller: StoreCtrl}).
    otherwise({redirectTo: '/'});
  }
]);


function loadGists() {
  $('.script').each(function(i,div) {
    $.ajax({
      url: $(div).data('src') + 'on',
      dataType: 'jsonp',
      success: function(gist) {
        $('head').append('<link rel="stylesheet" href="' + gist.stylesheet + '" type="text/css" />');
        $(div).append($(gist.div))
      }
    });
  });
}
var services = new Services();


function loadApps() {
  var apps = appStore;
  apps.forEach(function(a) {
    a.installed = services.uses(a.name);
  });
  return apps;
}

function IndexController($scope, $routeParams) {
// Don't load anything :)
}

function SettingsController($scope, $routeParams) {
// Load the settings :)
}

function PublishersController($scope, $routeParams) {
  loadGists();
}

function DevelopersController($scope, $routeParams) {
  loadGists();
}

function StoreCtrl($scope, $routeParams) {
  $scope.apps = loadApps();

  $scope.install = function installApp(app) {
    app.installed = true;
    services.register(app.registration.name, app.registration.url)
  };

  $scope.remove = function removeApp(app) {
    app.installed = false;
    services.removeService(app.registration.name);
  };

}
