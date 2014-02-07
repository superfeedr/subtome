'use strict';

angular.module('subtome')
.factory('subscriptions', function() {

  var data = {};
  var error = null;

  function load() {
    try {
      var subscriptionsString = localStorage.getItem('subscriptions');
    }
    catch(error) {
      console.error('There was an error, so we could not load the subscriptions from the localStorage. ', error);
      if(error.name === 'SecurityError' && error.code === 18) {
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
      catch(error) {
        console.error('Could not parse ' + subscriptionsString);
        error = 'We could not load your subscriptions. ';
      }
    }
  }

  function list() {
    var list = [];
    Object.keys(data).forEach(function(k) {
      data[k].forEach(function(subscription) {
        list.push(new Array(k, subscription.feeds));
      });
    });
    return list;
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

    var opml = '<?xml version="1.0" encoding="UTF-8"?><opml version="1.0"><head><title>Your Subscriptions</title></head><body>';
    Object.keys(data).forEach(function(k) {
      data[k].forEach(function(subscription) {
        subscription.feeds.forEach(function(f) {
          if(!feeds[f]) {
            feeds[f] = true;
            opml += '<outline xmlUrl="' + encodeURI(f) + '" htmlUrl="' + encodeURI(k) + '" />';
          }
        })
      });
    });
    opml += '</body></opml>';
    return opml;
  }

  load();

  return {
    opml: opml,
    save: save,
    add: add,
    list: list,
    all: all
  }
});


// var Subscriptions = function Subscriptions() {
//   this.data = {};
//   this.error = null;
//   this.load();

//   this.listeners = [];
//   if (window.addEventListener) {
//     var  = this;
//     window.addEventListener("storage", function() {
//       that.load();
//       that.listeners.forEach(function(listener) {
//         listener();
//       });
//     }, false);
//   };
// }


/*
Subscriptions.prototype.add = function addSubscriptions(url, obj) {
  if(!this.data[url]) {
    this.data[url] = [];
  }
  this.data[url].push(obj);
  this.save();
}

Subscriptions.prototype.save = function saveSubscriptions() {
  localStorage.setItem('subscriptions', JSON.stringify(this.data));
}

Subscriptions.prototype.listen = function listen(cb) {
  this.listeners.push(cb);
}


*/
