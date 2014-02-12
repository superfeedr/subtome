'use strict';

describe('Controller: SubscriptionsController', function () {

  beforeEach(module('subtome'));

  afterEach(function() {
    localStorage.clear();
  });

  it('should have the all the subscriptions in scope', function() {
    inject(function ($rootScope, $controller, subscriptions) {
      var scope = $rootScope.$new();
      subscriptions.add('http://blog.superfeedr.com', {feeds: ['http://blog.superfeedr.com/atom.xml'], service: 'My service'});
      $controller('SubscriptionsController', {$scope: scope, subscriptions: subscriptions});
      scope.$apply();
      expect(scope.subscriptions[0][0]).toBe('http://blog.superfeedr.com');
      expect(scope.subscriptions[0][1][0].feeds[0]).toBe('http://blog.superfeedr.com/atom.xml');
      expect(scope.subscriptions[0][1][0].service).toBe('My service');
    });
  });
});
