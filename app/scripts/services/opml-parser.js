'use strict';

angular.module('subtome')
.factory('opmlParser', function() {
  return function(contents) {
    var parser = new DOMParser();
    var opml = parser.parseFromString(contents, 'text/xml');
    var outlines = opml.getElementsByTagName('outline');
    var subscriptions = [];
    for(var i=0; i<outlines.length; i++) {
      subscriptions.push({feed: outlines[i].getAttribute('xmlUrl'), title: outlines[i].getAttribute('title') || outlines[i].getAttribute('text'), html: outlines[i].getAttribute('htmlUrl')});
    }
    return subscriptions;
  };
});
