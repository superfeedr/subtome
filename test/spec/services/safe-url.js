'use strict';

describe('Service: SafeUrl', function () {

  var safeUrl;

  module(function($provide) {
    $provide.value('$window', {});
  });

  beforeEach(function() {
    module('subtome');
    inject(function($injector) {
      safeUrl = $injector.get('safeUrl');
    });
  });

  it('should prevent data urls', function() {
    expect(safeUrl('data:text/html;charset=utf-8;base64,PCFET0...C9odG1sPg==')).toBe(false);
  });
  it('should prevent javascript urls', function() {
    expect(safeUrl(['javascript', 'alert("I am evil")'].join(':'))).toBe(false);
  });
  it('should accept http url', function() {
    expect(safeUrl('http://feedbin.me/?subscribe=http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml')).toBe(true);
  });
  it('should accept https url', function() {
    expect(safeUrl('https://feedbin.me/?subscribe=http%3A%2F%2Fblog.superfeedr.com%2Fatom.xml')).toBe(true);
  });
});

