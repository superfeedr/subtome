'use strict';

describe('Filter: pickColor', function () {

  beforeEach(angular.mock.module('subtome'));

  it('The application should have a pickColor filter', inject(function($filter) {
    expect($filter('pickColor')).not.toEqual(null);
  }));

  it('should return a different color for differen strings', inject(function($filter) {
    expect($filter('pickColor')('a')).toEqual('background-color: rgb(240, 173, 78)');
    expect($filter('pickColor')('b')).toEqual('background-color: rgb(217, 83, 79);');
    expect($filter('pickColor')('c')).toEqual('background-color: rgb(92, 184, 92)');
    expect($filter('pickColor')('d')).toEqual('background-color: rgb(66, 139, 202)');
    expect($filter('pickColor')('e')).toEqual('background-color: rgb(91, 192, 222)');
    expect($filter('pickColor')('f')).toEqual('background-color: rgb(240, 173, 78)');
  }));
});
