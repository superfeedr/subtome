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







})();
