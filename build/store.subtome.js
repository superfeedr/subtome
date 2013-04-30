var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var res = mod._cached ? mod._cached : mod();
    return res;
}

require.paths = [];
require.modules = {};
require.extensions = [".js",".coffee"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (require._core[x]) return x;
        var path = require.modules.path();
        cwd = path.resolve('/', cwd);
        var y = cwd || '/';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
            if (require.modules[x]) {
                return x;
            }
            
            for (var i = 0; i < require.extensions.length; i++) {
                var ext = require.extensions[i];
                if (require.modules[x + ext]) return x + ext;
            }
        }
        
        function loadAsDirectorySync (x) {
            x = x.replace(/\/+$/, '');
            var pkgfile = x + '/package.json';
            if (require.modules[pkgfile]) {
                var pkg = require.modules[pkgfile]();
                var b = pkg.browserify;
                if (typeof b === 'object' && b.main) {
                    var m = loadAsFileSync(path.resolve(x, b.main));
                    if (m) return m;
                }
                else if (typeof b === 'string') {
                    var m = loadAsFileSync(path.resolve(x, b));
                    if (m) return m;
                }
                else if (pkg.main) {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                }
            }
            
            return loadAsFileSync(x + '/index');
        }
        
        function loadNodeModulesSync (x, start) {
            var dirs = nodeModulesPathsSync(start);
            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                var m = loadAsFileSync(dir + '/' + x);
                if (m) return m;
                var n = loadAsDirectorySync(dir + '/' + x);
                if (n) return n;
            }
            
            var m = loadAsFileSync(x);
            if (m) return m;
        }
        
        function nodeModulesPathsSync (start) {
            var parts;
            if (start === '/') parts = [ '' ];
            else parts = path.normalize(start).split('/');
            
            var dirs = [];
            for (var i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === 'node_modules') continue;
                var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                dirs.push(dir);
            }
            
            return dirs;
        }
    };
})();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = (Object.keys || function (obj) {
        var res = [];
        for (var key in obj) res.push(key)
        return res;
    })(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

require.define = function (filename, fn) {
    var dirname = require._core[filename]
        ? ''
        : require.modules.path().dirname(filename)
    ;
    
    var require_ = function (file) {
        return require(file, dirname)
    };
    require_.resolve = function (name) {
        return require.resolve(name, dirname);
    };
    require_.modules = require.modules;
    require_.define = require.define;
    var module_ = { exports : {} };
    
    require.modules[filename] = function () {
        require.modules[filename]._cached = module_.exports;
        fn.call(
            module_.exports,
            require_,
            module_,
            module_.exports,
            dirname,
            filename
        );
        require.modules[filename]._cached = module_.exports;
        return module_.exports;
    };
};

if (typeof process === 'undefined') process = {};

if (!process.nextTick) process.nextTick = (function () {
    var queue = [];
    var canPost = typeof window !== 'undefined'
        && window.postMessage && window.addEventListener
    ;
    
    if (canPost) {
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'browserify-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);
    }
    
    return function (fn) {
        if (canPost) {
            queue.push(fn);
            window.postMessage('browserify-tick', '*');
        }
        else setTimeout(fn, 0);
    };
})();

if (!process.title) process.title = 'browser';

if (!process.binding) process.binding = function (name) {
    if (name === 'evals') return require('vm')
    else throw new Error('No such module')
};

if (!process.cwd) process.cwd = function () { return '.' };

if (!process.env) process.env = {};
if (!process.argv) process.argv = [];

require.define("path", function (require, module, exports, __dirname, __filename) {
function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

});

require.define("/compatibility.js", function (require, module, exports, __dirname, __filename) {
/* some IE8 love */

/* Array.reduce */
if ('function' !== typeof Array.prototype.reduce) {
  Array.prototype.reduce = function(callback, opt_initialValue){
    'use strict';
    if (null === this || 'undefined' === typeof this) {
      // At the moment all modern browsers, that support strict mode, have
      // native implementation of Array.prototype.reduce. For instance, IE8
      // does not support strict mode, so this check is actually useless.
      throw new TypeError(
                          'Array.prototype.reduce called on null or undefined');
    }
    if ('function' !== typeof callback) {
      throw new TypeError(callback + ' is not a function');
    }
    var index = 0, length = this.length >>> 0, value, isValueSet = false;
    if (1 < arguments.length) {
      value = opt_initialValue;
      isValueSet = true;
    }
    for ( ; length > index; ++index) {
      if (!this.hasOwnProperty(index)) continue;
      if (isValueSet) {
        value = callback(value, this[index], index, this);
      } else {
        value = this[index];
        isValueSet = true;
      }
    }
    if (!isValueSet) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    return value;
  };
}

/* Date.now */
if (!Date.now) {
  Date.now = function() {
    return new Date().valueOf();
  }
}

/* Array.indexOf */
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
    "use strict";
    if (this == null) {
      throw new TypeError();
    }
    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) {
      return -1;
    }
    var n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) {
        n = 0;
      } else if (n != 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  }
}

});

require.define("/services.js", function (require, module, exports, __dirname, __filename) {
var Services = function Services() {
  this.services = {};
  this.error = null;
  this.load();
}

Services.prototype.load = function loadServices() {
  try {
    var servicesString = localStorage.getItem('services');
  }
  catch(error) {
    console.error('There was an error, so we could not load the services from the localStorage. ', error);
    if(error.name === 'SecurityError' && error.code === 18) {
      this.error = 'A browser setting is preventing SubToMe from saving your favorite subscription tools. Open up Settings > Privacy. Then, make sure Accept cookies from sites is checked. Also, make sure Accept third-party is checked as well.';
    }
    else {
      this.error = 'We could not load your favorite subscriptions tools. ';
    }
  }
  if(servicesString) {
    try {
      this.services = JSON.parse(servicesString);
    }
    catch(error) {
      console.error('Could not parse ' + servicesString);
      this.error = 'Warning: We could not load your favorite subscriptions tools. ';
    }
  }
}

Services.prototype.count = function countServices() {
  var count = 0;
  for(var name in this.services) {
    count += 1;
  }
  return count;
}

Services.prototype.forEach = function forEachServices(iterator) {
  for(var name in this.services) {
    iterator(name, this.services[name]);
  }
}

Services.prototype.uses = function usesService(name) {
  return this.services[name] || false;
}

Services.prototype.save = function saveServices() {
  localStorage.setItem('services', JSON.stringify(this.services));
}

Services.prototype.removeService = function removeService(name) {
  delete this.services[name];
  this.save();
}

Services.prototype.register = function registerService(name, handler) {
  if(!this.services[name]) {
    this.services[name] = {
      url: handler,
      addedOn: Date.now()
    }
    this.save();
  }
}

module.exports = new Services();

});

require.define("/store.js", function (require, module, exports, __dirname, __filename) {
    require('./compatibility.js');
var services = require('./services');

var apps = [
{
  name: 'The Old Reader',
  tags: ['web', 'popular', 'advanced'],
  description: 'The Old Reader was built to be a Google Reader replacement, and it does it well!',
  url: 'http://theoldreader.com/',
  icon: 'http://theoldreader.com/favicon.ico',
  registration: {
    name: 'The Old Reader',
    url: 'http://theoldreader.com/feeds/subscribe?url={feed}'
  }
},
{
  name: 'NewsBlur',
  tags: ['web', 'mobile', 'advanced', 'open source'],
  description: 'NewsBlur is a personal news reader bringing people together to talk about the world.',
  url: 'http://www.newsblur.com/',
  icon: 'http://newsblur.com/favicon.ico',
  registration: {
    name: 'NewsBlur',
    url: 'http://www.newsblur.com/?url={url}'
  }
},
{
  name: 'Rivered',
  tags: ['web'],
  description: 'An uncluttered River of News; no unread item count, no complexity. Just the content you subscribe to.',
  url: 'http://www.rivered.io/',
  icon: 'http://www.rivered.io/favicon.ico',
  registration: {
    name: 'Rivered',
    url: 'http://www.rivered.io/add?url={url}'
  }
},
{
  name: 'Bloglovin',
  tags: ['web', 'iOS', 'blog'],
  description: 'Bloglovin was created to make reading blogs awesome.',
  url: 'http://www.bloglovin.com/',
  icon: 'http://www.bloglovin.com/images/favicon.ico',
  registration: {
    name: 'Bloglovin',
    url: 'http://www.bloglovin.com/search/{url}'
  }
},
{
  name: 'Blogtrottr',
  tags: ['email', 'digests'],
  description: 'Blogtrottr delivers updates from all of your favourite news, feeds, and blogs directly to your email inbox.',
  url: 'http://blogtrottr.com/',
  icon: 'http://blogtrottr.com/favicon.ico',
  registration: {
    name: 'Blogtrottr',
    url: 'http://blogtrottr.com/?subscribe={feed}'
  }
},
{
  name: 'BazQux Reader',
  tags: ['web', 'comments'],
  description: 'RSS feed reader that shows comments to posts and supports reading of Facebook and Google+ pages.',
  url: 'https://bazqux.com/',
  icon: 'https://bazqux.com/favicon.ico',
  registration: {
    name: 'BazQux',
    url: 'https://bazqux.com/add?url={url}'
  }
},
{
  name: 'Feedleap',
  tags: ['web', 'kippt', 'bookmark', 'open source'],
  description: 'FeedLeap lets you subscribe to your favorite RSS feeds and store new entries as Clips in any Kippt List you want.',
  url: 'https://feedleap.herokuapp.com',
  icon: 'https://feedleap.herokuapp.com/static/favicon.ico',
  registration: {
    name: 'Feedleap',
    url: 'https://feedleap.herokuapp.com/feeds/new/?feed={feed}&source=subtome'
  }
},
{
  name: 'FeedHQ',
  tags: ['web', 'mobile', 'open source'],
  description: 'FeedHQ is a feed reader built with readability and mobility in mind',
  url: 'https://feedhq.org/',
  icon: 'https://feedhq.org/static/core/img/icon-rss.png',
  registration: {
    name: 'FeedHQ',
    url: 'https://feedhq.org/subscribe/?feeds={feeds}&url={url}'
  }
},
{
  name: 'Feedbin',
  tags: ['web'],
  description: 'A fast, simple RSS feed reader that delivers a great reading experience.',
  url: 'https://feedbin.me/',
  icon: 'https://feedbin.me/favicon.ico',
  registration: {
    name: 'Feedbin',
    url: 'https://feedbin.me/?subscribe={feed}'
  }
},
{
  name: 'Feedly',
  tags: ['chrome', 'firefox', 'mobile'],
  description: 'Feedly is a news aggregator application for various Web browsers and mobile devices running iOS and Android.',
  url: 'http://feedly.com/',
  icon: 'http://feedly.com/favicon.ico',
  registration: {
    name: 'Feedly',
    url: 'http://www.feedly.com/home#subscription/feed/{feed}'
  }
},
{
  name: 'Msgboy',
  tags: ['chrome', 'open source'],
  description: 'Msgboy delivers a custom feed of stories in realtime, all based on websites you\'ve bookmarked and visited most often',
  url: 'http://www.msgboy.com/',
  icon: 'https://raw.github.com/superfeedr/msgboy/master/views/img/icon16.png',
  registration: {
    name: 'Msgboy',
    url: 'chrome-extension://ligglcbjgpiljeoenbhnnfdipkealakb/data/html/subscribe.html?url={url}'
  }
},
{
  name: 'Google Reader',
  tags: ['web', 'deprecated', 'advanced'],
  description: 'Google Reader will be shut down on July 1st 2013. We suggest you look at some other option.',
  url: 'http://www.google.com/reader',
  icon: 'https://www.google.com/reader/ui/favicon.ico',
  registration: {
    name: 'Google Reader',
    url: 'http://www.google.com/reader/view/feed/{feed}'
  }
}
];


function drawApp(a) {
  var div = $('#' + a.name.replace(/\s+/g, '-'));
  if(div.length == 0) {
    div = $('<div id="' + a.name.replace(/\s+/g, '-') + '" class="span2 app"></div>');
    div.appendTo('#apps');
  }
  div.empty();

  div.append($('<h4 style="background: url(' + a.icon + ') no-repeat 2px 2px; background-size: 16px 16px; padding-left: 20px"><a target="_blank" href="' + a.url + '">' + a.name + '</a></h4>'));
  a.tags.forEach(function(t) {
    div.append($('<span class="label">' + t + '</span>'), '&nbsp;');
  });
  div.append($('<p>' + a.description + '</p>'));


  if(!services.uses(a.name)) {
    var button = $('<button type="button" class="btn btn-mini">Install</button>');
    button.on('click', function() {
      services.register(a.name, a.registration.url);
      drawApp(a);
    });
  }
  else {
    div.append($('<span class="success"><i class="icon-ok"></i>Installed</span>'), '&nbsp;');
    var button = $('<button type="button" class="btn btn-mini btn-danger">Remove</button>');
    button.on('click', function() {
      services.removeService(a.name);
      drawApp(a);
    });
  }

  div.append(button);
}

$(document).on('ready', function() {
  apps.forEach(drawApp);
});

});
require("/store.js");
