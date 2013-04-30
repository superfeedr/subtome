require('./compatibility.js');
var services = require('./services');

var apps = [
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
  tags: ['web', 'mobile', 'advanced'],
  description: 'NewsBlur is a personal news reader bringing people together to talk about the world.',
  url: 'http://www.newsblur.com/',
  icon: 'http://newsblur.com/favicon.ico',
  registration: {
    name: 'NewsBlur',
    url: 'http://www.newsblur.com/?url={url}'
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
  tags: ['web', 'kippt', 'bookmark'],
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
  tags: ['web', 'mobile'],
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
  tags: ['chrome'],
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
