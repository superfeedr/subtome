'use strict';

var gulp = require('gulp');

var pkg = require('./package.json');

var jshint    = require('gulp-jshint');
var uglify    = require('gulp-uglify');
var webserver = require('gulp-webserver');
var karma     = require('gulp-karma');
var concat    = require('gulp-concat');
var rename    = require('gulp-rename');
var size      = require('gulp-size');
var header    = require('gulp-header');
var rimraf    = require('gulp-rimraf');

var getToday = function() {

	var today = new Date();
	var dd    = today.getDate();
	var mm    = today.getMonth() + 1; //January is 0!
	var yyyy  = today.getFullYear();

	if (dd < 10) {
	    dd = '0' + dd;
	}

	if (mm < 10) {
	    mm = '0' + mm;
	}

	return yyyy + '-' + mm + '-' + dd;

};

var headerMeta = ['/*!',
		' * <%= pkg.name %> - Version <%= pkg.version %> - ' + getToday(),
		' * Copyright (c) ' + new Date().getFullYear() + ' <%= pkg.author.name %>',
		' *',
		' * <%= pkg.description %>',
		' *',
		' * - Source: https://github.com/i18next/ng-i18next/',
		' * - Issues: https://github.com/i18next/ng-i18next/issues',
		' *',
		' * License: <%= pkg.licenses[0].type %> - <%= pkg.licenses[0].url %>',
		' *',
		'*/\n'
	].join('\n');

var headerMetaMin = '/*! <%= pkg.name %> - <%= pkg.version %> - ' + getToday() +
		' - Copyright (c) ' + new Date().getFullYear() + ' <%= pkg.author.name %>; Licensed <%= pkg.licenses[0].type %>*/';

// JS hint task
gulp.task('jshint', function() {

	return gulp.src([
		'gulpfile.js',
		'src/{,*/}*.js',
		'test/{,*/}*.js',
		'examples/{,*/}*.js'
	])
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'));

});

gulp.task('build', function() {

	//remove old files
	gulp.src('./dist/*', { read: false })
		.pipe(rimraf());

	return gulp.src(['./src/provider.js', './src/{,*/}*.js'])

		.pipe(concat(pkg.name + '.js'))
		.pipe(header(headerMeta, {pkg: pkg}))
		.pipe(gulp.dest('./dist/'))

		.pipe(rename(pkg.name + '.min.js'))
		.pipe(uglify())
		.pipe(header(headerMetaMin, {pkg: pkg}))
		.pipe(size())
		.pipe(gulp.dest('./dist/'));

});

//run tests
gulp.task('karma', function() {

	gulp.src([
			'bower_components/angular/angular.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'bower_components/i18next/i18next.min.js',
			'src/provider.js',
			'src/{,*/}*.js',
			'test/{,*/}*Spec.js'
		])
		.pipe(karma({
			configFile: 'karma.conf.js',
			action: 'run' //Run once
		}))
		.on('error', function(err) {
			// Make sure failed tests cause gulp to exit non-zero
			throw err;
		});

});

//TODO: documentation

gulp.task('default', function() {

	var info = [
		'',
		'  Usage:',
		'    - build: `gulp build`',
		'    - watch - test: `gulp watch`',
		'    - run examples: `gulp serve`',
		'      - Then open http://localhost:8000',
		'',
		'  For pull requests please run:',
		'    gulp test',
		'    gulp build',
		''
		].join('\n');

	console.info(info);
});

gulp.task('test', ['jshint', 'karma']);

gulp.task('serve', function() {

	gulp.src('./')
		.pipe(webserver({
			livereload: true,
			fallback: './examples/index.html'
		}));

});

gulp.task('watch', ['jshint', 'karma'], function() {

	// watch for JS changes
	gulp.watch('./src/{,*/}*.js', function() {
		gulp.run('jshint', 'karma');
	});

});

gulp.task('ci', ['test', 'build']);
