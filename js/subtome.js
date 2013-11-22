(function() {
var subtome = angular.module('subtome', ['jm.i18next', 'angular-ga']);

function safeUrl(url) {
  return !url.match(/^javascript:.*/) && !url.match(/^data:.*/);
}

subtome.config(['$routeProvider', 'AnalyticsProvider', '$i18nextProvider', function($routeProvider, AnalyticsProvider, $i18nextProvider) {
  AnalyticsProvider.setAccount('UA-39876787-1');

  $i18nextProvider.options = {
    lng: navigator.language,
    fallbackLng: 'en',
    useLocalStorage: true,
    localStorageExpirationTime: 1000 * 60 * 60 * 24,
    resGetPath: '../locales/__lng__/__ns__.json'
  };

  $routeProvider.
    when('/', {templateUrl: 'partials/index.html', controller: "IndexController"}).
    when('/settings', {templateUrl: 'partials/settings.html', controller: "SettingsController"}).
    when('/publishers', {templateUrl: 'partials/publishers.html', controller: "PublishersController"}).
    when('/developers', {templateUrl: 'partials/developers.html', controller: "DevelopersController"}).
    when('/register', {templateUrl: 'partials/register.html', controller: "RegisterController"}).
    when('/subscribe', {templateUrl: 'partials/subscribe.html', controller: "SubscribeController"}).
    when('/subscriptions', {templateUrl: 'partials/subscriptions.html', controller: "SubscriptionsController"}).
    when('/import', {templateUrl: 'partials/import.html', controller: "ImportController"}).
    when('/export', {templateUrl: 'partials/export.html', controller: "ExportController"}).
    when('/store', {templateUrl: 'partials/store.html', controller: "StoreController"}).
    when('/redirect', {templateUrl: 'partials/redirect.html', controller: "RedirectController"}).
    otherwise({redirectTo: '/'});
  }

]);

subtome.run(['$rootScope', '$location', function($rootScope, $location) {
  // window.navigator.registerContentHandler("application/vnd.mozilla.maybe.feed", "https://subtome.com/#/subscribe?feeds=%s",  "SubToMe");
  if ($location.path() !== '/subscribe') {
    $('.main-layout').show();
  }

  $rootScope.showBrowserSpecifics = function showBrowserSpecifics() {
    $('.browser-specific').each(function(i, b) {
      var browserSpecific = $(b).attr('class');
      if(typeof(browserSpecific) == 'string') {
        browserSpecific.split(' ').forEach(function(c) {
          if(navigator.userAgent.toLowerCase().indexOf(c) >= 0) {
            $(b).show();
          }
          else if(['browser-specific', 'ng-scope'].indexOf(c)) {
            // Nothing
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

  $rootScope.follow = function follow(arg) {
    var url;
    if(typeof(arg) === 'string') {
      url = arg;
    }
    else if(typeof(arg) === 'object' ) {
      url = arg.feed || arg.url;
    }
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
      s.setAttribute('src', '/#/subscribe?resource=' + encodeURIComponent(resource) + '&feeds=' + feeds.join(','));
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

subtome.directive('filePicker', function(){
  return {
    link: function($scope, $linkElement, $linkAttributes){
      $linkElement.bind('change', function(event) {
        var files = event.target.files;
        $scope.file = files[0];
        $scope.$apply();
      });
    }
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
    window.location = '/#/subscribe?resource=http://subtome.com&feeds=http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml&back=/#/';
  }
}]);

subtome.controller("SettingsController", ['$scope', function SettingsController($scope) {
  $scope.showBrowserSpecifics();
  $scope.remove = function removeService(service) {
    $scope.services.removeService(service.name);
  }
}]);

subtome.controller("PublishersController", ['$scope', function PublishersController($scope) {
  $window.location = "http://docs.subtome.com/publishers/";
}]);

subtome.controller("DevelopersController", [function DevelopersController() {
  $window.location = "http://docs.subtome.com/developers/";
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

subtome.controller("RegisterController", ['$scope', '$routeParams', 'Analytics', function RegisterController($scope, $routeParams, Analytics) {
  Analytics.trackEvent('services', 'register', $routeParams.name);
  $scope.services.register($routeParams.name, $routeParams.url);
  $scope.service = {name: $routeParams.name, url: $routeParams.url};
}]);

subtome.controller("SubscribeController", ['$scope', '$routeParams', 'Analytics', function SubscribeController($scope, $routeParams, Analytics) {
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
  Analytics.trackEvent('resources', 'subscribe', $scope.resource);

  // Extract the feeds information
  $scope.feeds = [];
  if($routeParams.feeds && $routeParams.feeds.length > 0) {
    $scope.feeds = $routeParams.feeds.split(",").map(function(url) {
      return decodeURIComponent(url);
    });
    Analytics.trackEvent('feeds', 'subscribe', $scope.feeds[0]);
  }

  // UI, switch between store and default
  $scope.toggleButton = i18n.t("View the full list of services");
  $scope.toggleStore = function toggleStore() {
    $scope.picker = $scope.picker == "store" && "default" || "store";
    if($scope.picker == "store") {
      $scope.toggleButton = i18n.t("Prefered services");
    }
    else {
      $scope.toggleButton = i18n.t("View the full list of services");
    }
  }

  // When a button is clicked.
  $scope.openService = function openService(service) {
    Analytics.trackEvent('services', 'redirect', service.name);
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

subtome.controller("ExportController", ['Analytics', function ExportController(Analytics) {
  var subscriptions = new Subscriptions().list();
  var opml = '<?xml version="1.0" encoding="UTF-8"?><opml version="1.0"><head><title>Your Subscriptions</title></head><body>';
  for (var k = 0; k < subscriptions.length; k++) {
    for (var l = 0; l < subscriptions[k][1].length; l++) {
      opml += '<outline xmlUrl="' + subscriptions[k][1][l] + '" htmlUrl="' + subscriptions[k][0] + '" />';
    }
  };
  opml += '</body></opml>';
  window.location = "data:application/xml;base64," + window.btoa(opml);
}]);

subtome.controller("ImportController", ['$scope', 'Analytics', function ImportController($scope, Analytics) {
  $scope.$watch('file', function() {
    if($scope.file) {
      var reader = new FileReader();
      reader.readAsText($scope.file, "UTF-8");
      reader.onload = function (evt) {
        var parser = new DOMParser();
        var opml = parser.parseFromString(evt.target.result, "text/xml");
        var outlines = opml.getElementsByTagName('outline');
        var subscriptions = [];
        for(var i=0; i<outlines.length; i++) {
          subscriptions.push({feed: outlines[i].getAttribute('xmlUrl'), title: outlines[i].getAttribute('title') || outlines[i].getAttribute('text'), html: outlines[i].getAttribute('htmlUrl')});
        }
        $scope.subscriptions = subscriptions;
        $scope.$apply();
      }
      reader.onerror = function (evt) {
        $scope.error = "Error Reading your OPML file. Make sure it's valid.";
        $scope.$apply();
      }
    }
  });
  $scope.subscriptions = [];
}]);

subtome.controller("SubscriptionsController", ['$scope', 'Analytics', function ImportController($scope, Analytics) {
  $scope.subscriptions = new Subscriptions().all();
  $scope.pickColor = function pickColor(string) {
    var colors = [
      "background-color: rgb(66, 139, 202)",
      "background-color: rgb(91, 192, 222)",
      "background-color: rgb(240, 173, 78)",
      "background-color: rgb(217, 83, 79);",
      "background-color: rgb(92, 184, 92)",
    ];
    var s = 0;
    for(var k = 0; k < string.length; k++) {
      s += string.charCodeAt(k);
    }
    return colors[s % colors.length];
  }
}]);

subtome.controller("RedirectController", ['$routeParams', '$scope', 'Analytics', function RedirectController($routeParams, $scope, Analytics) {
  $scope.info = 'Redirecting you to the feed...';
  var destination = decodeURIComponent($routeParams.to);
  if(!safeUrl(destination)) {
    return $scope.info = 'We could not achieve a redirect because this url ' + destination + ' is not safe.';
  }
  window.location = destination;
}]);

})();
