var subtome = angular.module('subtome', []);

subtome.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {templateUrl: 'partials/index.html',   controller: "IndexController"}).
    when('/settings', {templateUrl: 'partials/settings.html', controller: "SettingsController"}).
    when('/publishers', {templateUrl: 'partials/publishers.html', controller: "PublishersController"}).
    when('/developers', {templateUrl: 'partials/developers.html', controller: "DevelopersController"}).
    when('/store', {templateUrl: 'partials/store.html', controller: "StoreController"}).
    when('/register', {templateUrl: 'partials/register.html', controller: "RegisterController"}).
    when('/subscribe', {templateUrl: 'partials/subscribe.html', controller: "SubscribeController"}).
    otherwise({redirectTo: '/'});
  }
]);

subtome.run(['$rootScope', function($rootScope) {
  $rootScope.loadGists = function loadGists() {
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

  $rootScope.showBrowserSpecifics = function showBrowserSpecifics() {
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

  $rootScope.services = new Services();
  $rootScope.services.listen(function() {
    $rootScope.$apply();
  });

}]);

subtome.filter('fromNow', function() {
  return function(dateString) {
    return moment(new Date(dateString)).fromNow()
  };
});

subtome.controller("IndexController", function IndexController($scope) {
  $scope.over = function over() {
    document.getElementById('demo').innerHTML='Follow our Blog'
  }
  $scope.left = function left() {
    document.getElementById('demo').innerHTML='See it in Action';
  }
  $scope.open = function open() {
    var z=document.createElement('script');
    z.src='/load.js';
    document.body.appendChild(z);
  }
});

subtome.controller("SettingsController", function SettingsController($scope) {
  $scope.showBrowserSpecifics();
  $scope.remove = function removeService(service) {
    $scope.services.removeService(service.name);
  }
});

subtome.controller("PublishersController", function PublishersController($scope) {
  $scope.loadGists();
  $scope.open = function open(url) {
    if(!url) {
      var z=document.createElement('script');
      z.src='/load.js';
      document.body.appendChild(z);
    }
    else {
      var s = document.createElement('iframe');
      var feeds = [url];
      var resource = url;
      s.setAttribute('style','position:fixed;top:0px; left:0px; width:100%; height:100%; border:0px; background: transparent; z-index: 2147483647');
      s.setAttribute('src', 'https://www.subtome.com/subscribe.html?resource=' + encodeURIComponent(resource) + '&feeds=' + feeds.join(','));
      var loaded = false;
      s.onload = function() {
        if(loaded) {
          document.getElementsByTagName('body')[0].removeChild(s);
        }
        loaded = true;
      }
      document.getElementsByTagName('body')[0].appendChild(s);
    }
  }
});

subtome.controller("DevelopersController", function DevelopersController($scope) {
  $scope.loadGists();
});

subtome.controller("StoreController", function StoreController($scope) {
  var apps = appStore;
  apps.forEach(function(a) {
    a.installed = $scope.services.uses(a.name);
  });
  $scope.apps = apps;

  $scope.install = function installApp(app) {
    app.installed = true;
    $scope.services.register(app.registration.name, app.registration.url)
  };

  $scope.remove = function removeApp(app) {
    app.installed = false;
    $scope.services.removeService(app.registration.name);
  };
});

subtome.controller("RegisterController", function DevelopersController($scope, $routeParams) {
  $scope.services.register($routeParams.name, $routeParams.url);
  $scope.service = {name: $routeParams.name};
});

subtome.controller("SubscribeController", function SubscribeController($scope, $routeParams) {
  $("body").css("background", "transparent")
  $("hr").hide();
  $(".masthead").hide();
  $(".footer").hide();
  $(".github").hide();

  $('#subtomeModal').modal({backdrop: true, keyboard: true, show: true});
  $('#subtomeModal').on('hidden', function() {
    window.location = '/done.html';
  });

  $scope.resource = $routeParams.resource;
  $scope.feeds = [];
  if($routeParams.feeds && $routeParams.feeds.length > 0) {
    $scope.feeds = $routeParams.feeds.split(",");
  }

  $scope.openSettings = function openSettings() {
    window.open('https://www.subtome.com/settings.html');
  }

  $scope.openService = function openService(service) {
    $scope.services.register(service.name, service.url);
    var redirect = service.url.replace('{url}', encodeURIComponent($scope.resource));
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
    window.open(redirect);
  }
});

