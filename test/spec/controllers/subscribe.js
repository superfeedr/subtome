'use strict';

describe('Controller: SubscribeController', function () {
  var routeParams, windowMock;

  beforeEach(module('subtome'));

  beforeEach(function() {
    routeParams = {};
    windowMock = {};
    localStorage.clear();
  });

  afterEach(function() {
    localStorage.clear();
  });

  it('should set the picker, the subscriptions, the resource, the suggested, the feeds, the toggleButton, the apps and the services, as well as the showPopular in the scope', function() {
    inject(function ($rootScope, $controller) {
      var scope = $rootScope.$new();
      var _subscriptions = {};
      routeParams.resource = 'resource';
      routeParams.suggestedUrl = 'http://suggested.tld';
      routeParams.suggestedName = 'Suggested Service';
      routeParams.feeds = 'http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml,http%3A%2F%2Fpush-pub.appspot.com%2Ffeed';
      var _store = [{
        name: 'The Old Reader',
        tags: ['web', 'popular', 'advanced'],
        description: 'The Old Reader was built to be a Google Reader replacement, and it does it well!',
        url: 'http://theoldreader.com/',
        icon: 'http://theoldreader.com/favicon.ico',
        registration: {
          name: 'The Old Reader',
          url: 'http://theoldreader.com/feeds/subscribe?url={feed}'
        },
        installed: false
      }];
      var _services = {
        count: function() {
          return 0;
        }
      };
      $controller('SubscribeController', {$scope: scope, subscriptions: _subscriptions, $routeParams: routeParams, store: _store, services: _services});
      scope.$apply();
      expect(scope.picker).toBe('default');
      expect(scope.subscriptions).toBe(_subscriptions);
      expect(scope.resource).toBe(routeParams.resource);
      expect(scope.suggested[0].url).toBe(routeParams.suggestedUrl);
      expect(scope.suggested[0].name).toBe(routeParams.suggestedName);
      expect(scope.feeds[0]).toBe('http://blog.superfeedr.com/atom.xml');
      expect(scope.feeds[1]).toBe('http://push-pub.appspot.com/feed');
      expect(scope.toggleButton).toBe('View the full list of services');
      expect(scope.apps[0]).toBe(_store[0]);
      expect(scope.services).toBe(_services);
      expect(scope.showPopular).toBe(true);
    });
  });

  it('should should show the modal');

  it('should redirect the user when the modal is closed');

  it('should toggle the display between the prefered services and the list of all available', function() {
    inject(function ($rootScope, $controller, $window, $routeParams, $i18next, services, subscriptions, store) {
      var scope = $rootScope.$new();
      routeParams.resource = 'resource';
      routeParams.feeds = 'http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml';
      $controller('SubscribeController', {$scope: scope, subscriptions: subscriptions, $routeParams: routeParams, store: store, services: services});
      scope.$apply();
      expect(scope.toggleButton).toBe($i18next('View the full list of services'));
      expect(scope.picker).toBe('default');
      scope.toggleStore();
      expect(scope.toggleButton).toBe($i18next('Preferred services'));
      expect(scope.picker).toBe('store');
      scope.toggleStore();
      expect(scope.toggleButton).toBe($i18next('View the full list of services'));
      expect(scope.picker).toBe('default');
    });
  });
});
