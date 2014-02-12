'use strict';

describe('Controller: RedirectController', function () {
  var routeParams, windowMock;

  beforeEach(module('subtome'));

  beforeEach(function() {
    routeParams = {};
    windowMock = {};
  });

  it('should have the right scope info', function () {
    inject(function ($rootScope, $controller) {
      var scope = $rootScope.$new();
      $controller('RedirectController', {$scope: scope, $window: windowMock, $routeParams: routeParams});
      scope.$apply();
      expect(scope.info).toBe('Redirecting you to the feed...');
    });
  });

  it('should redirect to the home page if there is no destination', function () {
    inject(function ($rootScope, $controller) {
      var scope = $rootScope.$new();
      routeParams.to = '';
      $controller('RedirectController', {$scope: scope, $window: windowMock, $routeParams: routeParams});
      scope.$apply();
      expect(windowMock.location).toBe('/');
    });
  });

  it('should set an error if the url is not safe', function () {
    inject(function ($rootScope, $controller) {
      var scope = $rootScope.$new();
      var safeUrl = function() {
        return false;
      };
      routeParams.to = 'notsafe';
      $controller('RedirectController', {$scope: scope, $routeParams: routeParams, safeUrl: safeUrl});
      scope.$apply();
      expect(scope.info).toBe('We could not achieve a redirect because this URL notsafe is not safe.');
    });
  });

  it('should redirect to the right url if everything is fine', function () {
    inject(function ($rootScope, $controller) {
      var scope = $rootScope.$new();
      routeParams.to = 'the-destination';
      $controller('RedirectController', {$scope: scope, $routeParams: routeParams, $window: windowMock});
      scope.$apply();
      expect(windowMock.location).toBe('the-destination');
    });
  });
});
