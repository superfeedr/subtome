'use strict';

var subtome = angular.module('subtome', ['ngResource', 'ngSanitize', 'ngRoute', 'jm.i18next']);

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



