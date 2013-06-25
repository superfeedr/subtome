var subtome = angular.module('subtome', ['i18next', 'angular-google-analytics']);

subtome.config(['$routeProvider', 'AnalyticsProvider', function($routeProvider, AnalyticsProvider) {
  AnalyticsProvider.setAccount('UA-39876787-1');

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

subtome.run(['$rootScope', '$location', '$window', function($rootScope, $location, $window) {
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

subtome.filter('linkToHome', function() {
  return function(url) {
    var a = document.createElement('a');
    a.href = decodeURIComponent(url);
    return a.protocol + '//' + a.host + '/';
  };
});


subtome.controller("IndexController", ['$scope', function IndexController($scope) {
  $scope.over = function over() {
    document.getElementById('demo').innerHTML=i18n.t("Follow our Blog");
  }
  $scope.left = function left() {
    document.getElementById('demo').innerHTML=i18n.t("See it in Action");
  }
  $scope.follow = function follow() {
    var z=document.createElement('script');
    z.src='/load.js';
    document.body.appendChild(z);
  }
}]);

subtome.controller("SettingsController", ['$scope', function SettingsController($scope) {
  $scope.showBrowserSpecifics();
  $scope.remove = function removeService(service) {
    $scope.services.removeService(service.name);
  }
}]);

subtome.controller("PublishersController", ['$scope', function PublishersController($scope) {
  $scope.loadGists();
  $scope.follow = function follow(url) {
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
}]);

subtome.controller("DevelopersController", ['$scope', function DevelopersController($scope) {
  $scope.loadGists();
}]);

subtome.controller("StoreController", ['$scope', function StoreController($scope) {
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
}]);

subtome.controller("RegisterController", ['$scope', '$routeParams', 'Analytics', function DevelopersController($scope, $routeParams, Analytics) {
  Analytics.trackEvent('services', 'register', $routeParams.name);
  $scope.services.register($routeParams.name, $routeParams.url);
  $scope.service = {name: $routeParams.name, url: $routeParams.url};
}]);

subtome.controller("SubscribeController", ['$scope', '$routeParams', 'Analytics', function SubscribeController($scope, $routeParams, Analytics) {
  $("body").css("background", "transparent")
  $("hr").hide();
  $(".masthead").hide();
  $(".footer").hide();

  $('#subtomeModal').modal({backdrop: true, keyboard: true, show: true});
  $('#subtomeModal').on('hidden', function() {
    window.location = '/done.html';
  });

  $scope.resource = $routeParams.resource;
  Analytics.trackEvent('resources', 'subscribe', $scope.resource);
  $scope.feeds = [];
  if($routeParams.feeds && $routeParams.feeds.length > 0) {
    $scope.feeds = $routeParams.feeds.split(",");
    Analytics.trackEvent('feeds', 'subscribe', $scope.feeds[0]);
  }

  $scope.openSettings = function openSettings() {
    window.open('#/settings');
  }

  $scope.openService = function openService(service) {
    Analytics.trackEvent('services', 'redirect', service.name)
    var redirect = decodeURIComponent(service.url).replace('{url}', encodeURIComponent($scope.resource));
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
}]);

