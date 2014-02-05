'use strict';

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
	return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {

	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	var config = {
		src: './src',
		examples: './examples',
		dist: './dist'
	};

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		config: config,

		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>' +
				' - Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},

		ngdocs: {
			options: {
				dest: '<%= config.dist %>/docs',
				title: 'ng-i18next',
				html5Mode: false,
				scripts: ['angular.js'],
				startPage: '/guide'
			},
			guide: {
				src: ['docs/content/guide/*.ngdoc'],
				title: 'Guide'
			}
		},

		watch: {
			livereload: {
				options: {
					livereload: LIVERELOAD_PORT
				},
				files: [
					'<%= config.examples %>/{,*/}*.{html,js}',
					'{.tmp,<%= config.src %>}/{,*/}*.js'
				]
			}
		},

		connect: {
			options: {
				port: 9000,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: 'localhost'
			},
			livereload: {
				options: {
					middleware: function (connect) {
						return [
							lrSnippet,
							mountFolder(connect, '.tmp'),
							mountFolder(connect, './'),
							mountFolder(connect, config.examples)
						];
					}
				}
			},
			test: {
				options: {
					middleware: function (connect) {
						return [
							mountFolder(connect, '.tmp'),
							mountFolder(connect, 'test')
						];
					}
				}
			}
		},

		open: {
			server: {
				url: 'http://localhost:<%= connect.options.port %>'
			}
		},

		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= config.dist %>/*',
						'!<%= config.dist %>/.git*'
					]
				}]
			},
			doc: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= config.dist %>/docs/*',
					]
				}]
			},
			server: '.tmp'
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'src/{,*/}*.js',
				'test/{,*/}*.js',
				'examples/{,*/}*.js'
			]
		},

		concat: {
			dist: {
				src: ['src/provider.js', 'src/{,*/}*.js'],
				dest: '<%= config.dist %>/<%= pkg.name %>.js'
			}
		},

		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>'
			},
			src: {
				files: {
					'dist/ng-i18next.min.js': '<%= concat.dist.dest %>'
				}
			},
			dist: {
				files: {
					'<%= config.dist %>/<%= pkg.name %>.min.js': [
						'<%= concat.dist.dest %>'
					]
				}
			}
		}

	});

	grunt.registerTask('server', function (target) {

		if (target === 'dist') {
			return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
			'connect:livereload',
			'open',
			'watch'
		]);
	});

	grunt.registerTask('test', [
		'clean:server',
		'connect:test',
		'karma'
	]);

	/*
	 * 'build' neither tests the script nor does it run jshint!
	 * Also it does not create the documentation!
	 */
	grunt.registerTask('build', [
		'clean:dist',
		'concat',
		'uglify'
	]);

	grunt.registerTask('build:doc', [
		'clean:doc',
		'ngdocs'
	]);

	grunt.registerTask('default', [
		'jshint',
		'test',
		'build',
		'ngdocs'
	]);

};

