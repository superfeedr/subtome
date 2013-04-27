Subscribe Button
================

[SubToMe](https://www.subtome.com/) is a **universal subscribe button**.
It decouples the content to which a user can susbcribe from the application this user may want to use to perform the subscription.
It's losely inspired by [WebIntents](http://webintents.org/).

The spec is the code, and the code is open source. Feel free to contribute to it. You could very well run your own instance, but that means users may have to reselect their favorite subscription tool over and over again.

By design, all state is kept in the user's browser, using localStorage.

This is intented to be run as a bookmarklet or an embedded button on any web page.

# Workflow.

1. A user visits a site that is able to povide some kind of subscription mechanism. That web application will then embed in its page some code that will register this application on behalf of the user.

2. The subscription button script will store in the user's session the fact that he can use the previously described app for subscriptions.

3. Later, when on another site which publishes content, the user wants to follow a given resource and clicks on the bookmarklet.

4. The user is then showed the list of services that may be able to handle his subscription.

5. Once the user picks a service, he's sent to that service to complete the subscription.

Build
=====

Install dependencies (you need to have node.js installed):

<code>$ npm install</code>

Compiling the code:

<pre><code>$ browserify src/settings.js -o build/settings.subtome.js
$ browserify src/register.js -o build/register.subtome.js
$ browserify src/subscribe.js -o build/subscribe.subtome.js
$ browserify src/store.js -o build/store.subtome.js
</code></pre>

Check Also
==========

[Ant0ine](http://blog.ant0ine.com/) very kindly contributed a [SubToMe Chrome Extension](https://chrome.google.com/webstore/detail/subtome/cjkhnlmkkfheepafpgppmpdahbjgkjfc). [Source code](https://github.com/ant0ine/subtome-chrome-extension).

[Sören](http://www.soeren-hentzschel.at/) contributed a [SubToMe Firefox extension](https://addons.mozilla.org/en-US/firefox/addon/subtome-subscribe-button/)!

[Wordpress plugin](http://wordpress.org/extend/plugins/subtome/). Install it by following [these instructions](http://wordpress.org/extend/plugins/subtome/installation/) or look for `SubToMe` in your Wordpress Dashboard's plugin interface.

Todo
====

* Create a better icon/logo
* <del>Wordpress Plugin (button)</del> ([install](http://wordpress.org/extend/plugins/subtome)).
* Browser extensions ( <del>Chrome</del> [install](https://chrome.google.com/webstore/detail/subtome/cjkhnlmkkfheepafpgppmpdahbjgkjfc), <del>Firefox</del> [install](https://addons.mozilla.org/en-US/firefox/addon/subtome-subscribe-button/), Safari, IE).
* Integrate into more readers (RSS to email, RSS to xx... etc)
* Find ways to support non web based readers
* <del>Implement all the ideas from this [Ask HN](http://news.ycombinator.com/item?id=5197995) thread.</del>
* Find a hack to allow of a complete redirect with default settings. At this point, it seems extremely complex, as we would need a direct user action to do such. Most browsers tested at this point will opening of new windows as popups at this point :/

Going Further
=============

We intentionaly pushed the complexity down to the subscribing application, which should be smart enough to handle subscriptions if it has registered as such.

The subscribing application is in charge of extracting the data to which the user can subscribe (RSS or Atom feed, Social network handle, ... etc), from the page URL.

Registration for popular readers
================================
If you use any of the readers below, just click on their name to register them with #SubToMe.
* [The Old Reader](https://www.subtome.com/register.html?name=The+Old+Reader&url=http://theoldreader.com/feeds/subscribe?url=%7Bfeed%7D)
* [Google Reader](https://www.subtome.com/register.html?name=Google+Reader&url=http://www.google.com/reader/view/feed/%7Bfeed%7D?source=subtome)
* [NewsBlur](https://www.subtome.com/register.html?name=NewsBlur&url=http://www.newsblur.com/?url=%7Burl%7D)
* [Bloglovin](https://www.subtome.com/register.html?name=Bloglovin&url=http://www.bloglovin.com/search/%7Burl%7D)
* [Blogtrottr](https://www.subtome.com/register.html?name=Blogtrottr&url=http://blogtrottr.com/?subscribe=%7Bfeed%7D)
* [Feedly](https://www.subtome.com/register.html?name=Feedly&url=http%3A%2F%2Fwww.feedly.com%2Fhome%23subscription%2Ffeed%2F%7Bfeed%7D)
* [BazQux](https://www.subtome.com/register.html?name=BazQux&url=http%3A%2F%2Fbazqux.com%2Fadd%3Furl%3D%7Burl%7D)
* [Notifixlite](https://www.subtome.com/register.html?name=Notifixlite&url=http%3A%2F%2Fnotifixlite.appspot.com%2Fsubscribe%3Fresource%3D%7Burl%7D)
* [Msgboy](https://www.subtome.com/register.html?name=Msgboy&url=chrome-extension%3A%2F%2Fligglcbjgpiljeoenbhnnfdipkealakb%2Fdata%2Fhtml%2Fsubscribe.html%3Furl%3D%7Burl%7D)


Feel free to add yours (fork this page) if you implemented registration. Of course, don't expect your users to come here. Make sure you support [registration](https://www.subtome.com/developers.html).

Discussions
===========

[The Mozilla Hacks](https://hacks.mozilla.org/2013/02/subtome-a-better-subscribe-button/)

[Zemanta Blog](http://www.zemanta.com/blog/get-more-subscribers-simply/)

Thanks
======
[Ant0ine](http://blog.ant0ine.com/) for the Chrome extension, [Sören](http://www.soeren-hentzschel.at/) for the Firefox extension, [Matthias](http://notizblog.org/) for his help with the Wordpress plugin.

