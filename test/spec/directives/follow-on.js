'use strict';

describe('Directive: followOn', function () {

  beforeEach(angular.mock.module('subtome'));

  describe('followOn', function() {
    it('should add a script element to the page including the load.js file when clicked', function() {
      inject(function($compile, $rootScope, $window) {
        var action = 'click';

        var element = $compile('<span follow-on="' + action + '"></span>')($rootScope);
        element.trigger(action);
        expect($window.document.body.children[$window.document.body.children.length - 1].tagName).toBe('SCRIPT');
        expect($window.document.body.children[$window.document.body.children.length - 1].getAttribute('src')).toBe('/load.js');
      });
    });

    it('should add a script element to the page including the load.js file when clicked', function() {
      inject(function($compile, $rootScope, $window) {
        var action = 'click';
        var element = $compile('<span follow-on="' + action + '"></span>')($rootScope);
        element.trigger(action);
        expect($window.document.subtomeBtn).toBe(element[0]);
      });
    });
  });
});




