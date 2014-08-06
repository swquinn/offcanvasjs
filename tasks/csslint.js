'use strict';

module.exports = function csslint(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-contrib-csslint');

	return {
		options: {
			csslintrc: 'less/.csslintrc'
		},
		src: [
			'dist/css/offcanvas.css',
			'docs/assets/css/docs.css',
			'docs/examples/**/*.css'
		]
	};
}