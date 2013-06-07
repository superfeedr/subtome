angular.module('subtome', []).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {templateUrl: 'partials/index.html',   controller: IndexCtrl}).
    when('/settings', {templateUrl: 'partials/settings.html', controller: SettingsCtrl}).
    when('/publishers', {templateUrl: 'partials/publishers.html', controller: PublishersCtrl}).
    when('/developers', {templateUrl: 'partials/developers.html', controller: DevelopersCtrl}).
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

function IndexCtrl($scope, $routeParams) {
// Don't load anything :)
}

function SettingsCtrl($scope, $routeParams) {
// Load the settings :)
}

function PublishersCtrl($scope, $routeParams) {
  loadGists();
}

function DevelopersCtrl($scope, $routeParams) {
  loadGists();
}

function StoreCtrl($scope, $routeParams) {
  console.log("NOW WHAT?")
}
