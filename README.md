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

* <del>Create a better icon/logo</del>
* <del>Wordpress Plugin (button)</del> ([install](http://wordpress.org/extend/plugins/subtome)).
* Browser extensions ( <del>Chrome</del> [install](https://chrome.google.com/webstore/detail/subtome/cjkhnlmkkfheepafpgppmpdahbjgkjfc), <del>Firefox</del> [install](https://addons.mozilla.org/en-US/firefox/addon/subtome-subscribe-button/), Safari, IE).
* <del>Integrate into more readers (RSS to email, RSS to xx... etc)</del>
* Find ways to support non web based readers
* <del>Implement all the ideas from this [Ask HN](http://news.ycombinator.com/item?id=5197995) thread.</del>
* Find a hack to allow of a complete redirect with default settings. At this point, it seems extremely complex, as we would need a direct user action to do such. Most browsers tested at this point will opening of new windows as popups at this point :/

Going Further
=============

We intentionaly pushed the complexity down to the subscribing application, which should be smart enough to handle subscriptions if it has registered as such.

The subscribing application is in charge of extracting the data to which the user can subscribe (RSS or Atom feed, Social network handle, ... etc), from the page URL.

Registration for popular readers
================================

Feel free to check the [store](http://subtome.com/store.html)

Feel free to add yours if you implemented registration. Make sure you support [registration](https://www.subtome.com/developers.html)
as well for your existing users.

Discussions
===========

[The Mozilla Hacks](https://hacks.mozilla.org/2013/02/subtome-a-better-subscribe-button/)

[Zemanta Blog](http://www.zemanta.com/blog/get-more-subscribers-simply/)

Thanks
======
[Ant0ine](http://blog.ant0ine.com/) for the Chrome extension, [Sören](http://www.soeren-hentzschel.at/) for the Firefox extension, [Matthias](http://notizblog.org/) for his help with the Wordpress plugin.

