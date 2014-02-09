'use strict';

angular.module('subtome')
.factory('subscriptions', function() {

  var data = {};
  var error = null;

  function load() {
    var subscriptionsString = '';
    try {
      subscriptionsString = localStorage.getItem('subscriptions');
    }
    catch(e) {
      console.error('There was an error, so we could not load the subscriptions from the localStorage. ', e);
      if(e.name === 'SecurityError' && e.code === 18) {
        error = 'A browser setting is preventing SubToMe from saving your favorite subscription tools. Open up Settings > Privacy. Then, make sure Accept cookies from sites is checked. Also, make sure Accept third-party is checked as well.';
      }
      else {
        error = 'We could not load your subscriptions. ';
      }
    }
    if(subscriptionsString) {
      try {
        data = angular.fromJson(subscriptionsString);
      }
      catch(e) {
        console.error('Could not parse ' + subscriptionsString);
        error = 'We could not load your subscriptions. ';
      }
    }
  }

  function list() {
    var l = [];
    Object.keys(data).forEach(function(k) {
      data[k].forEach(function(subscription) {
        l.push(new Array(k, subscription.feeds));
      });
    });
    return l;
  }

  function all() {
    var list = [];
    Object.keys(data).forEach(function(k) {
      list.push(new Array(k, data[k]));
    });
    return list;
  }

  function add(url, obj) {
    if(!data[url]) {
      data[url] = [];
    }
    data[url].push(obj);
    save();
  }

  function save() {
    localStorage.setItem('subscriptions', angular.toJson(data));
  }


  function opml() {
    var feeds = {};

    var xml = '<?xml version="1.0" encoding="UTF-8"?><opml version="1.0"><head><title>Your Subscriptions</title></head><body>';
    Object.keys(data).forEach(function(k) {
      data[k].forEach(function(subscription) {
        subscription.feeds.forEach(function(f) {
          if(!feeds[f]) {
            feeds[f] = true;
            xml += '<outline xmlUrl="' + encodeURI(f) + '" htmlUrl="' + encodeURI(k) + '" />';
          }
        });
      });
    });
    xml += '</body></opml>';
    return xml;
  }

  load();

  return {
    opml: opml,
    save: save,
    add: add,
    list: list,
    all: all
  };
});

