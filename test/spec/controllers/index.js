'use strict';

describe('Controller: IndexController', function () {

  beforeEach(module('subtome'));

  it('should have the right scope', function () {
    inject(function ($rootScope, $controller, $i18next) {
      var scope = $rootScope.$new();
      $controller('IndexController', {$scope: scope, $i18next: $i18next});
      scope.$apply();
      expect(scope.button).toBe('See it in Action');
      scope.over();
      expect(scope.button).toBe('Follow our Blog');
      scope.left();
      expect(scope.button).toBe('See it in Action');
    });
  });
});
