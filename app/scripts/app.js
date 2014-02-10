'use strict';

var subtome = angular.module('subtome', ['ngResource', 'ngSanitize', 'ngRoute', 'ui.bootstrap', 'jm.i18next', 'ga']);

subtome.config(['$routeProvider', '$i18nextProvider', function($routeProvider, $i18nextProvider) {

  $i18nextProvider.options = {
    lng: navigator.language,
    fallbackLng: 'en',
    useLocalStorage: true,
    localStorageExpirationTime: 1000 * 60 * 60 * 24,
    resGetPath: '../locales/__lng__/__ns__.json'
  };

  $routeProvider.
  when('/', {templateUrl: 'views/index.html', controller: 'IndexController'}).
  when('/settings', {templateUrl: 'views/settings.html', controller: 'SettingsController'}).
  when('/publishers', {templateUrl: 'views/publishers.html', controller: 'PublishersController'}).
  when('/developers', {templateUrl: 'views/developers.html', controller: 'DevelopersController'}).
  when('/register', {templateUrl: 'views/register.html', controller: 'RegisterController'}).
  when('/subscribe', {templateUrl: 'views/subscribe.html', controller: 'SubscribeController'}).
  when('/subscriptions', {templateUrl: 'views/subscriptions.html', controller: 'SubscriptionsController'}).
  when('/import', {templateUrl: 'views/import.html', controller: 'ImportController'}).
  when('/export', {templateUrl: 'views/export.html', controller: 'ExportController'}).
  when('/share', {templateUrl: 'views/share.html', controller: 'ShareController'}).
  when('/store', {templateUrl: 'views/store.html', controller: 'StoreController'}).
  when('/redirect', {templateUrl: 'views/redirect.html', controller: 'RedirectController'}).
  otherwise({redirectTo: '/'});
}]);


subtome.run([function() {
  // window.navigator.registerContentHandler('application/vnd.mozilla.maybe.feed', 'https://subtome.com/#/subscribe?feeds=%s',  'SubToMe');
}]);

subtome.filter('fromNow', ['$window' , function($window) {
  return function(dateString) {
    return $window.moment(new Date(dateString)).fromNow();
  };
}]);

subtome.filter('linkToHome', function() {
  return function(url) {
    var a = document.createElement('a');
    a.href = decodeURIComponent(url);
    return a.protocol + '//' + a.host + '/';
  };
});


subtome.directive('followOn', [function() {
  return {
    restrict: 'A',
    link: function($scope, $element, $attrs) {
      if($attrs.followOn) {
        $element.bind($attrs.followOn, function(evt) {
          var z=document.createElement('script');
          if(evt) {
            document.subtomeBtn=evt.target;
          }
          z.src='/load.js';
          document.body.appendChild(z);
        });
      }
    }
  };
}]);

subtome.directive('hideOnPath', ['$rootScope', '$location' , function($rootScope, $location) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attrs) {
      function showOrHide() {
        if ($location.path() !== $attrs.hideOnPath) {
          $element.show();
        }
        else {
          $element.hide();
        }
      }
      $rootScope.$on('$locationChangeSuccess', showOrHide);
    }
  };
}]);

subtome.directive('browserSpecific', ['$window', function($window) {
  return {
    link: function($scope, $element, $attrs) {
      var showed = false;
      if($attrs.browserSpecific) {
        $attrs.browserSpecific.split(' ').forEach(function(c) {
          if($window.navigator.userAgent.toLowerCase().indexOf(c) >= 0) {
            showed = true;
          }
        });
      }
      if(showed)
        $element.show();
      else
        $element.hide();
    }
  };
}]);

subtome.directive('filePicker', function(){
  return {
    link: function($scope, $linkElement){
      $linkElement.bind('change', function(event) {
        var files = event.target.files;
        $scope.file = files[0];
        $scope.$apply();
      });
    }
  };
});
