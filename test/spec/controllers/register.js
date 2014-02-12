'use strict';

describe('Controller: RegisterController', function () {
  var routeParams, windowMock;

  beforeEach(module('subtome'));

  beforeEach(function() {
    localStorage.clear();
    routeParams = {};
    windowMock = {};
  });

  afterEach(function() {
    localStorage.clear();
  });

  it('should have the right scope info based on the route params', function () {
    inject(function ($rootScope, $controller) {
      var scope = $rootScope.$new();
      routeParams = {
        name: 'My Service',
        url: 'handler'
      };
      $controller('RegisterController', {$scope: scope, $window: windowMock, $routeParams: routeParams});
      scope.$apply();
      expect(scope.service.name).toBe(routeParams.name);
      expect(scope.service.url).toBe(routeParams.url);
    });
  });

  it('should have register the service based on the route params', function () {
    inject(function ($rootScope, $controller) {
      var scope = $rootScope.$new();
      routeParams = {
        name: 'My Service',
        url: 'handler'
      };
      var services = {
        register: jasmine.createSpy()
      };
      $controller('RegisterController', {$scope: scope, $window: windowMock, services: services, $routeParams: routeParams});
      scope.$apply();
      expect(services.register).toHaveBeenCalledWith(routeParams.name, routeParams.url);
    });
  });

  it('should have trigger a javascript event on the route params', function () {
    inject(function ($rootScope, $controller) {
      var scope = $rootScope.$new();
      routeParams = {
        name: 'My Service',
        url: 'handler'
      };
      var ga = jasmine.createSpy();
      $controller('RegisterController', {$scope: scope, $window: windowMock, ga: ga, $routeParams: routeParams});
      scope.$apply();
      expect(ga).toHaveBeenCalledWith('send', 'event', 'services', 'register', routeParams.name);
    });
  });
});
