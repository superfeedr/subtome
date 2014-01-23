var Subscriptions = function Subscriptions() {
  this.data = {};
  this.error = null;
  this.load();

  this.listeners = [];
  if (window.addEventListener) {
    var that = this;
    window.addEventListener("storage", function() {
      that.load();
      that.listeners.forEach(function(listener) {
        listener();
      });
    }, false);
  };
}

Subscriptions.prototype.load = function loadSubscriptions() {
  try {
    var subscriptionsString = localStorage.getItem('subscriptions');
  }
  catch(error) {
    console.error('There was an error, so we could not load the subscriptions from the localStorage. ', error);
    if(error.name === 'SecurityError' && error.code === 18) {
      this.error = 'A browser setting is preventing SubToMe from saving your favorite subscription tools. Open up Settings > Privacy. Then, make sure Accept cookies from sites is checked. Also, make sure Accept third-party is checked as well.';
    }
    else {
      this.error = 'We could not load your subscriptions. ';
    }
  }
  if(subscriptionsString) {
    try {
      this.data = JSON.parse(subscriptionsString);
    }
    catch(error) {
      console.error('Could not parse ' + subscriptionsString);
      this.error = 'We could not load your subscriptions. ';
    }
  }
}

Subscriptions.prototype.list = function subscriptionsList() {
  var list = [];
  var that = this;
  Object.keys(this.data).forEach(function(k) {
    that.data[k].forEach(function(subscription) {
      list.push(new Array(k, subscription.feeds));
    });
  });
  return list;
}

Subscriptions.prototype.all = function subscriptionsAll() {
  var list = [];
  var that = this;
  Object.keys(this.data).forEach(function(k) {
    list.push(new Array(k, that.data[k]));
  });
  return list;
}

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

Subscriptions.prototype.opml = function opml() {
  var feeds = {};
  var that = this;

  var opml = '<?xml version="1.0" encoding="UTF-8"?><opml version="1.0"><head><title>Your Subscriptions</title></head><body>';
  Object.keys(this.data).forEach(function(k) {
    that.data[k].forEach(function(subscription) {
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
