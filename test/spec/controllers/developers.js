'use strict';

describe('Controller: DevelopersController', function () {

  beforeEach(module('subtome'));

  it('should redirect to the docs', function () {
    inject(function ($location, $rootScope, $controller) {
      var scope = $rootScope.$new();
      var windowMock = {};
      $controller('DevelopersController', {$scope: scope, $window: windowMock});
      scope.$apply();
      expect(windowMock.location).toBe('http://docs.subtome.com/developers/');
    });
  });
});
