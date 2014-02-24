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

  it('should should send an event to Google Analytics with the resource', function() {
    inject(function ($rootScope, $controller, $window, $routeParams, ga, $i18next, services, subscriptions, store) {
      var scope = $rootScope.$new();
      routeParams.resource = 'resource';
      routeParams.feeds = 'http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml';
      var _ga = jasmine.createSpy();
      $controller('SubscribeController', {$scope: scope, ga: _ga, subscriptions: subscriptions, $routeParams: routeParams, store: store, services: services});
      scope.$apply();
      expect(_ga).toHaveBeenCalledWith('send', 'event', 'resources', 'subscribe', routeParams.resource);
      expect(_ga).toHaveBeenCalledWith('send', 'event', 'feeds', 'subscribe', decodeURIComponent(routeParams.feeds));
    });
  });

  it('should redirect the user when the modal is closed');

  it('should toggle the display between the prefered services and the list of all available', function() {
    inject(function ($rootScope, $controller, $window, $routeParams, ga, $i18next, services, subscriptions, store) {
      var scope = $rootScope.$new();
      routeParams.resource = 'resource';
      routeParams.feeds = 'http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml';
      $controller('SubscribeController', {$scope: scope, ga: ga, subscriptions: subscriptions, $routeParams: routeParams, store: store, services: services});
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

  it('should toggle an app between registered and removed', function() {
    inject(function ($rootScope, $controller, $window, $routeParams, ga, $i18next, services, subscriptions, store) {
      var scope = $rootScope.$new();
      routeParams.resource = 'resource';
      routeParams.feeds = 'http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml';
      $controller('SubscribeController', {$scope: scope, ga: ga, subscriptions: subscriptions, $routeParams: routeParams, store: store, services: services});
      scope.$apply();
      expect(services.uses(store[2].name)).toBe(false);
      scope.toggle(store[2]);
      expect(services.uses(store[2].name)).toBe(true);
      scope.toggle(store[2]);
      expect(services.uses(store[2].name)).toBe(false);
    });
  });

  describe('openService', function() {

    beforeEach(function() {
      localStorage.clear();
    });

    afterEach(function() {
      localStorage.clear();
    });

    it('should send a google analytics event', function() {
      inject(function ($rootScope, $controller, services, store, subscriptions) {
        var scope = $rootScope.$new();
        routeParams.resource = 'resource';
        routeParams.feeds = 'http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml';
        var _ga = jasmine.createSpy();
        $controller('SubscribeController', {$scope: scope, ga: _ga, subscriptions: subscriptions, $routeParams: routeParams, store: store, services: services});
        scope.$apply();
        scope.openService(store[2]);
        expect(_ga).toHaveBeenCalledWith('send', 'event', 'resources', 'subscribe', 'resource');
        expect(_ga).toHaveBeenCalledWith('send', 'event', 'feeds', 'subscribe', 'http://blog.superfeedr.com/atom.xml');
        expect(_ga).toHaveBeenCalledWith('send', 'event', 'services', 'redirect', 'Feedbin');
      });
    });

    it('should alert the user if the redirect is not safe', function() {
      inject(function ($rootScope, $controller, services, store, subscriptions) {
        var scope = $rootScope.$new();
        routeParams.resource = 'resource';
        routeParams.feeds = 'http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml';
        var _safeUrl = function() {
          return false;
        };
        var windowMock = {
          alert: jasmine.createSpy()
        };
        $controller('SubscribeController', {$window: windowMock, $scope: scope, subscriptions: subscriptions, $routeParams: routeParams, store: store, services: services, safeUrl: _safeUrl});
        scope.$apply();
        scope.openService(store[2]);
        expect(windowMock.alert).toHaveBeenCalledWith('It looks like this redirect is not safe. Please remove that service from your favorites.');
      });
    });

    it('should replace the {url} in the redirect url with the resource', function() {
      inject(function ($rootScope, $controller, services, store, subscriptions) {
        var scope = $rootScope.$new();
        routeParams.resource = 'resource';
        routeParams.feeds = 'http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml';
        windowMock.open = jasmine.createSpy();
        windowMock.parent = {
          postMessage: function() {}
        };
        $controller('SubscribeController', {$window: windowMock, $scope: scope, subscriptions: subscriptions, $routeParams: routeParams, store: store, services: services});
        scope.$apply();
        store[2].url = '{url}';
        scope.openService(store[2]);
        expect(windowMock.open).toHaveBeenCalledWith(routeParams.resource);
      });
    });

    it('should replace the {feed} in the redirect url with the first feed if there are several', function() {
      inject(function ($rootScope, $controller, services, store, subscriptions) {
        var scope = $rootScope.$new();
        routeParams.resource = 'resource';
        routeParams.feeds = 'http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml,http%3A%2F%2Fpush-pub.appspot.com%2Ffeed';
        windowMock.open = jasmine.createSpy();
        windowMock.parent = {
          postMessage: function() {}
        };
        $controller('SubscribeController', {$window: windowMock, $scope: scope, subscriptions: subscriptions, $routeParams: routeParams, store: store, services: services});
        scope.$apply();
        store[2].url = '{feed}';
        scope.openService(store[2]);
        expect(windowMock.open).toHaveBeenCalledWith('http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml');
      });
    });

    it('should replace the {feed} in the redirect url with the only feed if there is just one', function() {
      inject(function ($rootScope, $controller, services, store, subscriptions) {
        var scope = $rootScope.$new();
        routeParams.resource = 'resource';
        routeParams.feeds = 'http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml';
        windowMock.open = jasmine.createSpy();
        windowMock.parent = {
          postMessage: function() {}
        };
        $controller('SubscribeController', {$window: windowMock, $scope: scope, subscriptions: subscriptions, $routeParams: routeParams, store: store, services: services});
        scope.$apply();
        store[2].url = '{feed}';
        scope.openService(store[2]);
        expect(windowMock.open).toHaveBeenCalledWith('http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml');
      });
    });

    it('should replace the {feeds} in the redirect url with the only feed with all feeds if there are multiple', function() {
      inject(function ($rootScope, $controller, services, store, subscriptions) {
        var scope = $rootScope.$new();
        routeParams.resource = 'resource';
        routeParams.feeds = 'http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml,http%3A%2F%2Fpush-pub.appspot.com%2Ffeed';
        windowMock.open = jasmine.createSpy();
        windowMock.parent = {
          postMessage: function() {}
        };
        $controller('SubscribeController', {$window: windowMock, $scope: scope, subscriptions: subscriptions, $routeParams: routeParams, store: store, services: services});
        scope.$apply();
        store[2].url = '{feeds}';
        scope.openService(store[2]);
        expect(windowMock.open).toHaveBeenCalledWith('http://blog.superfeedr.com/atom.xml,http://push-pub.appspot.com/feed');
      });
    });

    it('should add a subscription to the list of subscriptions', function() {
      inject(function ($rootScope, $controller, services, store, subscriptions) {
        var scope = $rootScope.$new();
        routeParams.resource = 'resource';
        routeParams.feeds = 'http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml,http%3A%2F%2Fpush-pub.appspot.com%2Ffeed';
        windowMock.open = jasmine.createSpy();
        windowMock.parent = {
          postMessage: function() {}
        };
        $controller('SubscribeController', {$window: windowMock, $scope: scope, subscriptions: subscriptions, $routeParams: routeParams, store: store, services: services});
        scope.$apply();
        store[2].url = '{feeds}';
        scope.openService(store[2]);
        expect(subscriptions.all().length).toBe(1);
        expect(subscriptions.all()[0][0]).toBe(routeParams.resource);
        expect(subscriptions.all()[0][1][0].feeds[0]).toBe('http://blog.superfeedr.com/atom.xml');
        expect(subscriptions.all()[0][1][0].feeds[1]).toBe('http://push-pub.appspot.com/feed');
        expect(subscriptions.all()[0][1][0].service).toBe(store[2].name);
      });
    });

    it('should post a message to the parent', function() {
      inject(function ($rootScope, $controller, services, store, subscriptions) {
        var scope = $rootScope.$new();
        routeParams.resource = 'resource';
        routeParams.feeds = 'http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml,http%3A%2F%2Fpush-pub.appspot.com%2Ffeed';
        windowMock.open = jasmine.createSpy();
        windowMock.parent = {
          postMessage: jasmine.createSpy()
        };
        $controller('SubscribeController', {$window: windowMock, $scope: scope, subscriptions: subscriptions, $routeParams: routeParams, store: store, services: services});
        scope.$apply();
        scope.openService(store[2]);
        expect(windowMock.parent.postMessage).toHaveBeenCalled();
      });
    });

    it('should open the redirect in a new tab', function() {
      inject(function ($rootScope, $controller, services, store, subscriptions) {
        var scope = $rootScope.$new();
        routeParams.resource = 'resource';
        routeParams.feeds = 'http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml,http%3A%2F%2Fpush-pub.appspot.com%2Ffeed';
        windowMock.open = jasmine.createSpy();
        windowMock.parent = {
          postMessage: jasmine.createSpy()
        };
        $controller('SubscribeController', {$window: windowMock, $scope: scope, subscriptions: subscriptions, $routeParams: routeParams, store: store, services: services});
        scope.$apply();
        scope.openService(store[2]);
        expect(windowMock.open).toHaveBeenCalledWith('https://feedbin.me/?subscribe=http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml');
      });
    });
  });
});
