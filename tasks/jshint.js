'use strict';

module.exports = function jshint(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-contrib-jshint');

	return {
		options: {
			jshintrc: 'js/.jshintrc'
		},
		grunt: {
			options: {
				jshintrc: 'grunt/.jshintrc'
			},
			src: ['Gruntfile.js', 'grunt/*.js']
		},
		src: {
			src: 'js/*.js'
		},
		test: {
			src: 'js/tests/unit/*.js'
		}
	};
}