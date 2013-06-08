var subtome = angular.module('subtome', []);

subtome.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {templateUrl: 'partials/index.html',   controller: "IndexController"}).
    when('/settings', {templateUrl: 'partials/settings.html', controller: "SettingsController"}).
    when('/publishers', {templateUrl: 'partials/publishers.html', controller: "PublishersController"}).
    when('/developers', {templateUrl: 'partials/developers.html', controller: "DevelopersController"}).
    when('/store', {templateUrl: 'partials/store.html', controller: "StoreController"}).
    otherwise({redirectTo: '/'});
  }
]);

subtome.filter('fromNow', function() {
  return function(dateString) {
    return moment(new Date(dateString)).fromNow()
  };
});

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

function showBrowserSpecifics() {
 $('.browser-specific').each(function(i, b) {
  var browserSpecific = $(b).attr('class');
  if(typeof(browserSpecific) == 'string') {
    browserSpecific.split(' ').forEach(function(c) {
      if(navigator.userAgent.toLowerCase().indexOf(c) >= 0) {
        $(b).show();
      }
      else {
        $(b).hide();
      }
    });
  }
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

subtome.controller("IndexController", function IndexController($scope, $routeParams) {
});

subtome.controller("SettingsController", function SettingsController($scope, $routeParams) {
  showBrowserSpecifics();
  $scope.services = services.used();
  $scope.remove = function removeService(service) {
    services.removeService(service.name);
    $scope.services = services.used();
  }
});

subtome.controller("PublishersController", function PublishersController($scope, $routeParams) {
  loadGists();
});

subtome.controller("DevelopersController", function DevelopersController($scope, $routeParams) {
  loadGists();
});

subtome.controller("StoreController", function StoreController($scope, $routeParams) {
  $scope.apps = loadApps();

  $scope.install = function installApp(app) {
    app.installed = true;
    services.register(app.registration.name, app.registration.url)
  };

  $scope.remove = function removeApp(app) {
    app.installed = false;
    services.removeService(app.registration.name);
  };
});
