'use strict';

describe('Filter: fromNow', function () {

  beforeEach(angular.mock.module('subtome'));

  it('The application should have a fromNow filter', inject(function($filter) {
    expect($filter('fromNow')).not.toEqual(null);
  }));

  it('should return a string version of the time', inject(function($filter) {
    expect($filter('fromNow')(new Date())).toEqual('a few seconds ago');
  }));

});
