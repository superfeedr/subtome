'use strict';

describe('Filter: linkToHome', function () {

  beforeEach(angular.mock.module('subtome'));

  it('The application should have a linkToHome filter', inject(function($filter) {
    expect($filter('linkToHome')).not.toEqual(null);
  }));

  it('should return the link to the home page given a url', inject(function($filter) {
    expect($filter('linkToHome')('https://feedbin.me/?subscribe={feed}')).toEqual('https://feedbin.me/');
    expect($filter('linkToHome')('https://feedbin.me/')).toEqual('https://feedbin.me/');
  }));

});
