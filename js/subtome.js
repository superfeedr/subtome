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
    when('/share', {templateUrl: 'partials/share.html', controller: "ShareController"}).
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

  $rootScope.follow = function follow(evt) {
    var z=document.createElement('script');
    if(evt) {
      document.subtomeBtn=evt.target;
    }
    z.src='/load.js';
    document.body.appendChild(z);
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
      $scope.toggleButton = i18n.t("Preferred services");
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
  var opml = new Subscriptions().opml();
  window.location = "data:application/xml;base64," + window.btoa(opml);
}]);

subtome.controller("ShareController", ['$scope', '$routeParams', 'Analytics', function ShareController($scope, $routeParams, Analytics) {

  $scope.url = $routeParams.url;
  var a = $('<a>', { href:$scope.url } )[0];
  $scope.urlRoot = a.protocol + '//' + a.hostname ;
  if(a.port)
    $scope.urlRoot += ':' + a.port
  $scope.urlRoot += '/';
  var opml = new Subscriptions().opml();
  $scope.share = function() {
    window.location = $routeParams.url.replace('{subscriptions}', btoa(opml));
  }
  $scope.deny = function() {
    window.location = '/#/subscriptions';
  }
}]);

subtome.controller("ImportController", ['$scope', '$routeParams', 'Analytics', function ImportController($scope, $routeParams, Analytics) {
  $scope.subscriptions = [];

  function parseFile(contents) {
    var parser = new DOMParser();
    var opml = parser.parseFromString(contents, "text/xml");
    var outlines = opml.getElementsByTagName('outline');
    var subscriptions = [];
    for(var i=0; i<outlines.length; i++) {
      subscriptions.push({feed: outlines[i].getAttribute('xmlUrl'), title: outlines[i].getAttribute('title') || outlines[i].getAttribute('text'), html: outlines[i].getAttribute('htmlUrl')});
    }
    return subscriptions;
  }

  $scope.$watch('file', function() {
    if($scope.file) {
      var reader = new FileReader();
      reader.readAsText($scope.file, "UTF-8");
      reader.onload = function (evt) {
        $scope.subscriptions = parseFile(evt.target.result);
        $scope.$apply();
      }
      reader.onerror = function (evt) {
        $scope.error = "Error reading your OPML file. Make sure it's valid.";
        $scope.$apply();
      }
    }
  });

  if($routeParams.opml) {
    $scope.subscriptions = parseFile(atob($routeParams.opml));
  }
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
  if(!$routeParams.to)
    return window.location = '/';
  var destination = decodeURIComponent($routeParams.to);
  if(!safeUrl(destination)) {
    return $scope.info = 'We could not achieve a redirect because this URL ' + destination + ' is not safe.';
  }
  if(history && history.pushState)
    history.pushState({}, "SubToMe: Subscribe", "/#/subscribe?resource=" + destination + "&feeds=" + destination + "");
  window.location = destination;
}]);

})();
