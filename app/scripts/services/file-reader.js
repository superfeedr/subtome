'use strict';

angular.module('subtome')
.factory('fileReader', function() {
  return function(file, onSuccess, onError) {
    var reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = function (evt) {
      onSuccess(evt.target.result);
    };
    reader.onerror = function () {
      onError('Error reading your OPML file. Make sure it\'s valid.');
    };
  };
});
