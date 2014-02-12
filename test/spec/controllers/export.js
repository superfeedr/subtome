'use strict';

describe('Controller: ExportController', function () {

  beforeEach(module('subtome'));

  it('should redirect to the data-uri of an opml', function () {
    inject(function ($location, $rootScope, $controller, subscriptions, $window) {
      var scope = $rootScope.$new();
      var windowMock = {};
      $controller('ExportController', {$scope: scope, $window: windowMock, subscriptions: subscriptions});
      scope.$apply();
      expect(windowMock.location).toBe('data:application/xml;base64,' + $window.btoa(subscriptions.opml()));
    });
  });
});
