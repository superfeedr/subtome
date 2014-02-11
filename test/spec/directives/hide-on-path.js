'use strict';

describe('Directive: hideOnPath', function () {

  beforeEach(angular.mock.module('subtome'));

  describe('hideOnPath', function() {
    it('should keep the element hidden if it the path does match', function() {


      inject(function($compile, $rootScope, $location) {
        $location.path('/path-which-hides');
        var element = $compile('<span hide-on-path="/path-which-hides"></span>')($rootScope);
        $rootScope.$apply();
        expect(element.css('display')).toBe('none');
      });
    });

    it('should keep the element shown if it the path does not match', function() {


      inject(function($compile, $rootScope, $location) {
        $location.path('/path-which-shows');
        var element = $compile('<span hide-on-path="/path-which-hides"></span>')($rootScope);
        $rootScope.$apply();
        expect(element.css('display')).toBe('inline');
      });
    });

    it('should set a element previously shown to hidden if the location is updated', function() {

      inject(function($compile, $rootScope, $location) {
        $location.path('/path-which-shows');
        var element = $compile('<span hide-on-path="/path-which-hides"></span>')($rootScope);
        $rootScope.$apply();
        expect(element.css('display')).toBe('inline');
        $location.path('/path-which-hides');
        $rootScope.$apply();
        expect(element.css('display')).toBe('none');
      });
    });

  });
});




