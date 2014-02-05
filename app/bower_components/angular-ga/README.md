Google Universal Analytics adapter for AngularJS
================================================

`angular-ga` is a very straightforward AngularJS adapter of the 
**new** [google analytics script](https://developers.google.com/analytics/devguides/collection/analyticsjs/). 

It gives you full control of your analytics, exposing the google's `ga()` function for you.
What it means is, that it will set the page field on every route change for You, but you will 
have to send the pageviews, events etc. manually. But on the other hand, you have the full control of that process.

Usage
=====

## Embed tracking code

Include the **new** universal analytics script in your html as usual, but remove `ga('send', 'pageview');`

## Enable the ga module
```js
angular.module('yourModule', ['ga'])
```

## Use ga service in your controllers, directives etc...

`angular-ga` service is accessible as `ga`. Use it exactly the same, as `ga()` [asynchronous function](https://developers.google.com/analytics/devguides/collection/analyticsjs/method-reference):

```js
angular.module('myModule')
    .controller('myCtrl', function (ga) {
        ga('set', 'dimension1', 'Hello!');
        ga('send', 'pageview', {title: 'Hello world!'});
    });
```

## Use ga directive in html

Contents of the directive should be the array of parameters for `ga()` function. 
You can skip the enclosing array '[]' if you start with the single-quote character.

Of course, you can use angular expressions, as this is evaluated.

Both samples are equivalent to calling `ga('send', 'event', 'player', 'play', video.id)` on the `click` event:
```
<a href="#" ga="'send', 'event', 'player', 'play', video.id"></a>
<a href="#" ga="['send', 'event', 'player', 'play', video.id]"></a>
```

You can call `ga` several times by passing an array of arrays:
```
<a href="#" ga="[['set', 'metric1', 10], ['send', 'event', 'player', 'play', video.id]]"></a>
```

You can change the event by providing `ga-on` attribute
```
<input type="text" ga="'send', 'event', 'focus'" ga-on="focus" />
```

By using `ga-on="init"` you can call `ga` as soon as the html is parsed
```
<div ga="'send', 'pageview', {title: 'Hello world!'}" ga-on="init" />
```

## Use ga directive's auto events

If `ga` attribute is empty, the event is guesses from the context. Following examples
are equivalent:
```html
<div ga>LABEL</div>
<div ga="'send', 'event', 'button', 'click', 'LABEL'">LABEL</div>
```

```html
<a href="#" ga>LABEL</a>
<a href="#" ga="'send', 'event', 'button', 'click', 'LABEL'">LABEL</a>
```

```html
<a href="#anchor" ga>LABEL</a>
<a href="#anchor" ga="'send', 'event', 'button', '#anchor', 'LABEL'">LABEL</a>
```

```html
<a href="/" ga>LABEL</a>
<a href="/" ga="'send', 'event', 'link-in', '/', 'LABEL'">LABEL</a>
```

```html
<a href="https://github.com/panrafal/angular-ga" ga>LABEL</a>
<a href="https://github.com/panrafal/angular-ga" ga="'send', 'event', 'link-out', 'https://github.com/panrafal/angular-ga', 'LABEL'">LABEL</a>
```

```html
<input type="submit" value="SUBMIT" ga />
<input type="submit" value="SUBMIT" ga="'send', 'event', 'button', 'click', 'SUBMIT'" />
```

