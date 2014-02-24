'use strict';

describe('Directive usesService', function () {

  beforeEach(angular.mock.module('subtome'));

  beforeEach(function() {
    localStorage.clear();
  });

  afterEach(function() {
    localStorage.clear();
  });

  it('should have the right class if the service is used', function() {
    inject(function($compile, $rootScope, services) {
      var scope = $rootScope;
      scope.service = {
        name: 'My Used Service',
        url: 'http://service.tld/used'
      };
      services.register(scope.service.name, scope.service.url);
      var element = $compile('<span uses-service>Thing</span>')(scope);
      $rootScope.$apply();
      expect(element.attr('class')).toBe('ng-scope glyphicon glyphicon-remove');
    });
  });

  it('should have the right class if the service is not used', function() {
    inject(function($compile, $rootScope) {
      var scope = $rootScope;
      scope.service = {
        name: 'My Used Service',
        url: 'http://service.tld/used'
      };
      var element = $compile('<span uses-service>Thing</span>')(scope);
      $rootScope.$apply();
      expect(element.attr('class')).toBe('ng-scope glyphicon glyphicon-heart');
    });
  });

  it('should add an app that was not previously used', function() {
    inject(function($compile, $rootScope, services) {
      $rootScope.service = {
        name: 'My Used Service',
        url: 'http://service.tld/used'
      };
      services.removeService($rootScope.service.name);
      var element = $compile('<span uses-service>Thing</span>')($rootScope);
      var scope = element.scope();
      scope.toggle();
      scope.$apply();
      expect(services.uses($rootScope.service.name)).toBe(true);
    });
  });

  it('should remove an app that was previously used', function() {
    inject(function($compile, $rootScope, services) {
      $rootScope.service = {
        name: 'My Used Service',
        url: 'http://service.tld/used'
      };
      services.register($rootScope.service.name, $rootScope.service.url);
      var element = $compile('<span uses-service>Thing</span>')($rootScope);
      var scope = element.scope();
      scope.toggle();
      scope.$apply();
      expect(services.uses($rootScope.service.name)).toBe(false);
    });
  });
});




