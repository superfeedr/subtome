'use strict';

describe('Controller: StoreController', function () {
  beforeEach(module('subtome'));

  afterEach(function() {
    localStorage.clear();
  });

  it('should have the apps and services in the scope', function() {
    inject(function ($rootScope, $controller) {
      var scope = $rootScope.$new();
      var _store = [];
      var _services = {};
      $controller('StoreController', {$scope: scope, services: _services, store: _store});
      scope.$apply();
      expect(scope.apps).toBe(_store);
      expect(scope.services).toBe(_services);
    });
  });
  it('should make sure all apps are marked as used if they are a used service', function() {
    inject(function ($rootScope, $controller, services, store) {
      var scope = $rootScope.$new();
      services.register(store[2].name, store[2].registration.url);
      $controller('StoreController', {$scope: scope, services: services, store: store});
      scope.$apply();
      expect(scope.apps[2].installed).toBe(true);
    });
  });

  it('should register an app when installed is invoked and mark it as installed', function() {
    inject(function ($rootScope, $controller, services, store) {
      var scope = $rootScope.$new();
      var _services = {
        uses: function() {return false;},
        register: jasmine.createSpy()
      };

      $controller('StoreController', {$scope: scope, services: _services, store: store});
      scope.$apply();
      scope.install(store[2]);
      expect(store[2].installed).toBe(true);
      expect(_services.register).toHaveBeenCalledWith(store[2].name, store[2].registration.url);
    });
  });
  it('should unregister an app when remove is invoked and mark it as not installed', function() {
    inject(function ($rootScope, $controller, services, store) {
      var scope = $rootScope.$new();
      var _services = {
        uses: function() {return false;},
        register: jasmine.createSpy(),
        removeService: jasmine.createSpy()
      };

      $controller('StoreController', {$scope: scope, services: _services, store: store});
      scope.$apply();
      scope.install(store[2]);
      expect(store[2].installed).toBe(true);
      expect(_services.register).toHaveBeenCalledWith(store[2].name, store[2].registration.url);
      scope.remove(store[2]);
      expect(store[2].installed).toBe(false);
      expect(_services.removeService).toHaveBeenCalledWith(store[2].name);
    });
  });
});
