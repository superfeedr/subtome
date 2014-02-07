'use strict';

angular.module('subtome')
.factory('safeUrl', function() {
  return function(url) {
    return !url.match(/^javascript:.*/) && !url.match(/^data:.*/);
  }
});
