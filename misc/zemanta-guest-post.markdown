# SubToMe: a better subscribe button

Blogging is a lot like media publishing: your content is more valuable if it is consumed by more people. This means that you need
to make sure you **control its distribution** as much as you can.

## Distributing your content

Distributing content is not easy: you can share it on your social networks account or you can work hard on seach engine optimisation to make sure that people who look for the topic you're writing about eventually find it.

SEO is a slow process... and if you tend to write time sensitive information, it won't be that useful. 

Distributing on social networks is also dangerous, as these networks have agendas of their own which may not be aligned with your interests. For example, when you post an update to Facebook, not all your friends see it, just those whom Facebook think might be interested. Similarly, people who follow you on Twitter may not be 100% interested in your blog, and people who are interested in your blog may not use Twitter or want to follow you...

Blogs actually have had a dedicated feature to **subscriptions**: **RSS feeds**, but they're usually hard to use for most people: they looks *weird* in the browser, and it's not obvious how to use them for not-so-advanced web users.

## A subscribe button

Everybody knows how to use a **button**, so we decided to create that button for bloggers. It's called [SubToMe](http://www.subtome.com/). One of it's central features is that it *lets your readers chose* their readers or the delivery mean: email, SMS, instant messaging... etc, based on the applications they already use.

Using this button, you don't have to put a thousand *follow me on XXX* buttons on your site (and hence avoid to turn it into a christmas tree).

Also, the button itself is pure HTML, which means you can customize it in any way you want to make it fit your style.

Try it yourself: <input type="button" onclick="(function(){var z=document.createElement('script');z.src='https://www.subtome.com/load.js';document.body.appendChild(z);})()" value="Follow Zemanta's Blog">

## Integrate it

First thing first: it is important to remember that this button works on any website, provided they have an RSS feed (it's the case of any serious blogging platform).

The code below includes what you need to add to your page:
<script src="https://gist.github.com/julien51/4332573.js">
</script>
As you see it's quite 'small' and won't affect the performance of your page in any way (as it does not load anything until after a user clicked the button).

Now, if you use Wordpress, you can quickly and easily integrate SubToMe with this [widget](http://wordpress.org/extend/plugins/subtome/). 

Finally, this is a very early stage project, you want to learn more, please check the [SubToMe website](http://www.subtome.com/). [We](http://superfeedr.com/) would love to get your feedback!





