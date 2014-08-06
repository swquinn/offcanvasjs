'use strict';

module.exports = function copy(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-contrib-copy');

	return {
		fonts: {
			expand: true,
			src: 'fonts/*',
			dest: 'dist/'
		},
		docs: {
			expand: true,
			src: 'docs/examples/**/*',
			dest: 'dist/'
		}
	};
}