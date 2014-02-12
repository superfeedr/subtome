'use strict';

describe('Service: opmlParser', function () {

  var opmlParser;

  module(function($provide) {
    $provide.value('$window', {});
  });

  beforeEach(function() {
    module('subtome');
    inject(function($injector) {
      opmlParser = $injector.get('opmlParser');
    });
  });


});

