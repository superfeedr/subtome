# ng-i18next - use i18next with Angularjs #

Project goal is to provide an easy way to use [i18next](http://i18next.com/) with [AngularJS](http://angularjs.org/):

- `ng-i18next` directive
- `i18next` filter

First check out the [documentation](http://i18next.com) by Jan Mühlemann.

# Features #
- AngularJS directive
- AngularJS filter
- variable binding (translates again, if variable changes)
- nested translations (`$t('hello')`; see i18next documentation)
- scope variables in translations (if the translation contains directives of variables like `{{hello}}`, they'll get compiled)

# Usage #
First add

- AngularJS
- i18next
- ng-i18next

to your HTML file.

Make sure you require `jm.i18next` as a dependency of your AngularJS module. Also configurate the provider first:

```js
angular.module('jm.i18next').config(['$i18nextProvider', function ($i18nextProvider) {
	$i18nextProvider.options = {
		lng: 'de',
		useCookie: false,
		useLocalStorage: false,
		fallbackLng: 'dev',
		resGetPath: '../locales/__lng__/__ns__.json'
	};
}]);
```

For more options visit the [i18next documentation](http://i18next.com/pages/doc_init.html).

There are two ways to use ````ng-i18next````:

## filter ##
	<p>{{'hello' | i18next}}</p>
=> translates ````hello````

	<p>{{hello | i18next}}</p>
=> translates ````$scope.hello````

## directive ##

### Basics ###

	<p ng-i18next="hello"></p>
=> translates ````hello````

	<p ng-i18next="{{hello}}"></p>
=> translates ````$scope.hello````

	<p ng-i18next>hello</p>
=> translates ````hello```` (uses the content of the p-tag)

	<p ng-i18next>{{hello}}</p>
=> translates ````$scope.hello```` (uses the content of the p-tag)

Note, that HTML isn't compiled!

### HTML ###

	<p ng-i18next="[html]hello"></p>
=> translates ````hello```` and compiles HTML

	<p ng-i18next="[html]{{hello}}"></p>
=> translates ````$scope.hello```` and compiles HTML

### Attributes ###

	<a href="#" ng-i18next="[title]hello">This is a link.</a>
=> translates ````hello```` and sets it as the title

	<a href="#" ng-i18next="[title]{{hello}}">This is a link.</a>
=> translates ````$scope.hello```` and sets it as the title

You can combine both, too!

### Attributes + text content ###

	<a href="#" ng-i18next="[title]hello;content"></a>
=> translates ````hello```` and sets it as the title
=> translates ````content```` and sets it as the text of the link.

	<a href="#" ng-i18next="[title]{{hello}};{{content}}"></a>
=> translates ````$scope.hello```` and sets it as the title
=> translates ````$scope.content```` and sets it as the text of the link.

### Attributes + HTML content ###

	<a href="#" ng-i18next="[title]hello;[html]content"></a>
=> translates ````hello```` and sets it as the title
=> translates ````content```` and compiles the HTML as the content of the link.

	<a href="#" ng-i18next="[title]{{hello}};[html]{{content}}"></a>
=> translates ````$scope.hello```` and sets it as the title
=> translates ````$scope.content```` and compiles the HTML as the content of the link.

### Passing Options ###
You can also pass options:

	<p ng-i18next="[i18next]({lng:'de'})hello"></p>
=> translates ````hello```` in German (````de````)

### Passing Options + HTML ###
You can also pass options:

	<p ng-i18next="[html:i18next]({lng:'de'})hello"></p>
=> translates ````hello```` in German (````de````) and compiles it to HTML code.

---------

For more, see examples.

---------

# Contribute #

To contribute, you must have:

- [Node.js](http://nodejs.org/)
- [bower](http://bower.io/)

installed.

Load all dependencies using [`npm`](https://npmjs.org/) and [`bower`](http://bower.io/):

	npm install
	bower install

Build `ng-i18next.js` using Grunt:

	grunt

---------

# Examples #

You can run the examples using:

	grunt server

_(note that you have to be in the root directory of this project)_

---------

# Changelog #

v0.2.9
- fix error (#28) when using `ng-i18next` directive with options containing parentheses

v0.2.8
- fixed #24 - fixed an error with IE8

v0.2.7
- fixed #21 - fixed error when using `ng-model` and `ng-i18next` on the same element

v0.2.6
- fixed #15 - fixed error "$digest already in progress"
- added docs using ng-docs

v0.2.5
- fixed some minor bugs (in filter)

v0.2.4
- removed unnecessary code in provider.js
- fixed issue #14 where auto detection of language didn't work

v0.2.3
- fixed minification
- not using `ngmin` anymore

v0.2.2
- you can now pass options to a directive
- new tests and Gruntfile (now supports `grunt server`)
- updated dependencies in package.json
- you can now pass options to the filter

v0.2.1
- it is now possible to change options at runtime (and not only in `.config()`)
- the dist folder was added

v0.2
- completly new version
- `i18next` provider, directive and filter

v0.1
- first version
