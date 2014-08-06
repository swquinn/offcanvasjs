'use strict';

module.exports = function sed(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-sed');

	return {
		versionNumber: {
			pattern: (function () {
				var old = grunt.option('oldver');
				return old ? RegExp.quote(old) : old;
			})(),
			replacement: grunt.option('newver'),
			recursive: true
		}
	};
}