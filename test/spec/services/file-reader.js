'use strict';

describe('Service: fileReader', function () {

  var fileReader;

  module(function($provide) {
    $provide.value('$window', {});
  });

  beforeEach(function() {
    module('subtome');
    inject(function($injector) {
      fileReader = $injector.get('fileReader');
    });
  });


});

