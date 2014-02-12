'use strict';

describe('Controller: ImportController', function () {
  var controller, scope, opml, routeParams;

  beforeEach(module('subtome'));

  beforeEach(function() {
    inject(function ($rootScope, $controller, subscriptions) {
      scope = $rootScope.$new();
      controller = $controller;
      subscriptions.add('http://blog.superfeedr.com/', {feeds: ['http://blog.superfeedr.com/atom.xml'], service: 'My Subscription Service'});
      opml = subscriptions.opml();
      routeParams = {};
    });
  });

  it('should set the scope\'s subscription to an empty array by default', function () {
    controller = controller('ImportController', {$scope: scope, $routeParams: routeParams});
    scope.$apply();
    expect(scope.subscriptions.length).toBe(0);
  });

  it('should set the scope\'s subscription to the list of subscriotions if an opml is passed as a route param', function () {
    routeParams.opml = opml;
    controller = controller('ImportController', {$scope: scope, $routeParams: routeParams});
    scope.$apply();
    expect(scope.subscriptions.length).toBe(1);
    expect(scope.subscriptions[0]).toBe(1);
  });

  describe('when the file is changed', function() {
    var opmlParser, fileReader;

    beforeEach(function() {
      opmlParser = function() {
        return [{feed: 'http://blog.superfeedr.com/atom.xml', title: 'Superfeedr Blog', html: 'http://blog.superfeedr.com/'}];
      };

      fileReader = function(name, onsuccess) {
        onsuccess('filecontent');
      };
    });

    it('should read it', function() {
      fileReader = jasmine.createSpy();
      controller = controller('ImportController', {$scope: scope, $routeParams: routeParams, opmlParser: opmlParser, fileReader: fileReader});
      var myFile = {};
      scope.file = myFile;
      scope.$apply();
      expect(fileReader).toHaveBeenCalledWith(myFile, jasmine.any(Function), jasmine.any(Function));
    });

    it('should parse the opml out of it', function() {
      opmlParser = jasmine.createSpy();
      controller = controller('ImportController', {$scope: scope, $routeParams: routeParams, opmlParser: opmlParser, fileReader: fileReader});
      var myFile = {};
      scope.file = myFile;
      scope.$apply();
      expect(opmlParser).toHaveBeenCalledWith('filecontent');
    });

    it('should set the subscription accordingly', function() {
      controller = controller('ImportController', {$scope: scope, $routeParams: routeParams, opmlParser: opmlParser, fileReader: fileReader});
      var myFile = {};
      scope.file = myFile;
      scope.$apply();
      expect(scope.subscriptions[0].feed).toBe('http://blog.superfeedr.com/atom.xml');
      expect(scope.subscriptions[0].title).toBe('Superfeedr Blog');
      expect(scope.subscriptions[0].html).toBe('http://blog.superfeedr.com/');
    });
  });
});
