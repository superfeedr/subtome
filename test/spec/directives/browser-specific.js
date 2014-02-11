'use strict';

describe('Directive: browserSpecific', function () {

  beforeEach(angular.mock.module('subtome'));

  describe('browserSpecific', function() {
    it('should keep the element hidden if it does not match the browser', function() {
      module(function($provide) {
        $provide.value('$window', {
          navigator: {
            userAgent: 'My UserAgent does not match'
          }
        });
      });
      inject(function($compile, $rootScope) {
        var element = $compile('<span browser-specific="chrome"></span>')($rootScope);
        expect(element.css('display')).toBe('none');
      });
    });

    it('should show the element if it does match the browser', function() {
      module(function($provide) {
        $provide.value('$window', {
          navigator: {
            userAgent: 'My UserAgent does match Chrome'
          }
        });
      });
      inject(function($compile, $rootScope) {
        var element = $compile('<span browser-specific="chrome"></span>')($rootScope);
        expect(element.css('display')).toBe('inline');
      });
    });
  });
});




