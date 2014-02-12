'use strict';

describe('Controller: SettingsController', function () {

  beforeEach(module('subtome'));

  afterEach(function() {
    localStorage.clear();
  });

  it('should set the right scope', function () {
    inject(function ($rootScope, $controller) {
      var scope = $rootScope.$new();
      var services = {
        removeService: jasmine.createSpy()
      };
      $controller('SettingsController', {$scope: scope, services: services});
      scope.$apply();
      expect(scope.services).toBe(services);
      var toBeRemoved = {
        name: 'My Service'
      };
      scope.remove(toBeRemoved);
      expect(services.removeService).toHaveBeenCalledWith(toBeRemoved.name);
    });
  });

});
