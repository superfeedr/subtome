'use strict';

describe('Controller: ShareController', function () {
  var routeParams, windowMock;

  beforeEach(module('subtome'));

  beforeEach(function() {
    routeParams = {};
    windowMock = {};
  });

  afterEach(function() {
    localStorage.clear();
  });

  it('should set the right scope url, urlRoot, ', function () {
    inject(function ($rootScope, $controller) {
      var scope = $rootScope.$new();
      var routeParams = {
        url: 'http://my.reader.tld/import/subscriptions?subscription={subscriptions}'
      };
      $controller('ShareController', {$scope: scope, $routeParams: routeParams});
      scope.$apply();
      expect(scope.url).toBe(routeParams.url);
      expect(scope.urlRoot).toBe('http://my.reader.tld/');
    });
  });

  it('should redirect to the destination when share is called with the right location', function () {
    inject(function ($rootScope, $controller) {
      var scope = $rootScope.$new();
      var routeParams = {
        url: 'http://my.reader.tld/import/subscriptions?subscription={subscriptions}'
      };
      var subscriptions = {
        opml: function() {
          return '<opmlfile>';
        }
      };
      $controller('ShareController', {$scope: scope, $routeParams: routeParams, $window: windowMock, subscriptions: subscriptions});
      scope.$apply();
      scope.share();
      expect(windowMock.location).toBe('http://my.reader.tld/import/subscriptions?subscription=PG9wbWxmaWxlPg==');
    });
  });

  it('should redirect to the subscriptions list when share is called', function () {
    inject(function ($rootScope, $controller) {
      var scope = $rootScope.$new();
      var routeParams = {
        url: 'http://my.reader.tld/import/subscriptions?subscription={subscriptions}'
      };
      $controller('ShareController', {$scope: scope, $routeParams: routeParams, $window: windowMock});
      scope.$apply();
      scope.deny();
      expect(windowMock.location).toBe('/#/subscriptions');
    });
  });

});
