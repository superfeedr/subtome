'use strict';

angular.module('subtome')
.factory('subscriptions', function() {

  var d = {};
  var err = null;

  function load() {
    var subscriptionsString = '';
    try {
      subscriptionsString = localStorage.getItem('subscriptions');
    }
    catch(e) {
      console.error('There was an error, so we could not load the subscriptions from the localStorage. ', e);
      if(e.name === 'SecurityError' && e.code === 18) {
        err = 'A browser setting is preventing SubToMe from saving your favorite subscription tools. Open up Settings > Privacy. Then, make sure Accept cookies from sites is checked. Also, make sure Accept third-party is checked as well.';
      }
      else {
        err = 'We could not load your subscriptions. ';
      }
    }
    if(subscriptionsString) {
      try {
        d = angular.fromJson(subscriptionsString);
      }
      catch(e) {
        console.error('Could not parse ' + subscriptionsString);
        err = 'We could not load your subscriptions. ';
      }
    }
  }

  function add(url, obj) {
    if(!d[url]) {
      d[url] = [];
    }
    d[url].push(obj);
    save();
  }

  function save() {
    localStorage.setItem('subscriptions', angular.toJson(d));
  }

  function list() {
    var l = [];
    Object.keys(d).forEach(function(k) {
      d[k].forEach(function(subscription) {
        l.push(new Array(k, subscription.feeds));
      });
    });
    return l;
  }

  function all() {
    var list = [];
    Object.keys(d).forEach(function(k) {
      list.push(new Array(k, d[k]));
    });
    return list;
  }

  function opml() {
    var feeds = {};

    var xml = '<?xml version="1.0" encoding="UTF-8"?><opml version="1.0"><head><title>Your Subscriptions</title></head><body>';
    Object.keys(d).forEach(function(k) {
      d[k].forEach(function(subscription) {
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

  function error() {
    return err;
  }

  function data() {
    return d;
  }

  load();

  return {
    data: data,
    error: error,
    opml: opml,
    save: save,
    add: add,
    list: list,
    all: all,
    load: load
  };
});

