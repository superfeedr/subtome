# SubToMe: a better subscribe button


One of the most common features of web apps is the ability to subscribe:

* Most news websites or blogs have RSS feeds that enable 
users to **subscribe** to upcoming posts and articles in their favorite readers.
* Social web applications such as Twitter, Tumblr or Instagram allow you to **follow** other users.
* Github allows you to **watch** projects to be informed about new code changes

## RSS Feeds are complex

Unfortunately, the subscribing experience is less than satisfying: it's *very hard for regular web users to subscribe to a feed in a reader*. First, they have to find the feed on a page, then, once they read the cryptic XML code, they have to copy and paste the url into a reader of their choice. When we consider that most people don't even know what a url is, we know that this experience will never be mainstream.

## Centralization is easy

On the other end, it is actually very easy to follow people on twitter or to follow new Tumblr blogs. We actually believe that *these platforms are successful because it is indeed easy and works very well*. But the ease comes from the fact that these platforms are centralized: you need to be a twitter user to subscribe to other twitter users.

However, this has never been the web's true spirit: you don't need to be a gmail user to send an email to another gmail user.

## The Browser as the middleman

When we decided to tackle the subscribe problem we had to find a solution that embrassed **both the decentralized web** that we love and the **simplicity of a button** that user could just click on.

Try it yourself: <input type="button" onclick="(function(){var z=document.createElement('script');z.src='https://www.subtome.com/load.js';document.body.appendChild(z);})()" value="Follow Mozilla Hacks">

The approach we took *decoupled* the subscribing web applications from the publishing web application by using the browser and its [localstorage](https://developer.mozilla.org/en-US/docs/DOM/Storage#localStorage) as a middleman, with a set of redirects and iframes to send the subscriber to its favorite reader.

![The tool picker](./subtome-screenshot.png)

When you click on the button above, your browser will load an iframe from [SubToMe](http://www.subtome.com/), this iframe will extract your data from a localStorage instance with the list of your favorite subscribing applications. The iframe also keeps track of the page on which it was loaded.

Eventually, when you select one of the apps, the browser opens a new window to it with the right information, and *voilà*!

### Code

The implementation is actually surprisingly simple. When you click the button, the following code is loaded. It simply extracts the feed(s) and then loads an iframe which will show the user's preferred services. The iframe url includes the feeds as well as the url of the page on which the button was clicked.

<script src="https://gist.github.com/julien51/4946654.js">
</script>

The iframe is loaded from the `subtome.com` domain, which means it can access a dedicated localStorage instance for the user.

The "reader" registration for a given user works using the same pattern: a hidden iframe is loaded and the information about that reader is stored in the user localStorage instance. Feel free to check the source code on the [Github repository](https://github.com/superfeedr/subtome/tree/master/src).

## Web Activities?

Of course, some of you may be worried that this uses an app running at  [SubToMe](http://www.subtome.com/). This is perfectly right, except that this application is actually just a static HTML page running on amazon S3: there is no web application. Also, the full code is open source and public on [github](https://github.com/superfeedr/subtome).

Now, very recently, Firefox adopted [Web Activities](https://hacks.mozilla.org/2013/01/introducing-web-activities/). Why couldn't we use that? The first reason is that this spec was only implemented by Firefox, which cuts the rest of the web. The second reason is that we do not expect most readers to implement that yet. This means that there is a need for some kind of "shim" which can do that on their behalf for now!

## Get Started!

Interested by this? If you're a publisher, the easiest thing you could do is start [adding such a button](http://www.subtome.com/publishers.html) to your site or your blog. Remember that people subscribed to your blog will tend to read your articles more and come back more often.

<script src="https://gist.github.com/julien51/4332573.js">
</script>

If you've created a reader, you could maybe [register with SubToMe](http://www.subtome.com/developers.html) so that your users subscribe to content online more easily. It's easy to do so!

Finally, this is a very early stage project, you want to learn more, please check the [SubToMe website](http://www.subtome.com/). [We](http://superfeedr.com/) would love to get your feedback!.






