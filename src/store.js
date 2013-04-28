require('./compatibility.js');

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
  name: 'Feedly',
  tags: ['Chrome', 'Firefox', 'Mobile'],
  description: 'Feedly is a news aggregator application for various Web browsers and mobile devices running iOS and Android.',
  url: 'http://feedly.com/',
  icon: 'http://feedly.com/favicon.ico',
  registration: {
    name: 'Feedly',
    url: 'http://www.feedly.com/home#subscription/feed/{feed}'
  }
},
{
  name: 'BazQux',
  tags: ['Web', 'Comments'],
  description: 'RSS feed reader that shows comments to posts and supports reading of Facebook and Google+ pages.',
  url: 'http://bazqux.com/',
  icon: 'http://bazqux.com/favicon.ico',
  registration: {
    name: 'BazQux',
    url: 'http://bazqux.com/add?url={url}'
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
  name: 'Msgboy',
  tags: ['Chrome'],
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
  icon: '',
  registration: {
    name: 'Google Reader',
    url: 'http://www.google.com/reader/view/feed/{feed}'
  }
}
];

$(document).on('ready', function() {
  apps.forEach(function(a) {
    var div = $('<div class="span2 app"></div>');
    div.append($('<h4 style="background: url(' + a.icon + ') no-repeat 2px 2px; background-size: 16px 16px; padding-left: 20px"><a target="_blank" href="' + a.url + '">' + a.name + '</a></h4>'));
    a.tags.forEach(function(t) {
      div.append($('<span class="label">' + t + '</span>'), '&nbsp;');
    });
    div.append($('<p>' + a.description + '</p>'));
    var button = $('<button type="button" class="btn btn-mini">Install</button>');
    button.on('click', function() {
      window.open('/register.html?name=' + encodeURIComponent(a.registration.name)  + '&url=' + encodeURIComponent(a.registration.url));
    });
    div.append(button);
    div.appendTo('#apps');
  });
});
