'use strict';

module.exports = function validation(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-html-validation');

	return {
		options: {
			charset: 'utf-8',
			doctype: 'HTML5',
			failHard: true,
			reset: true,
			relaxerror: [
				'Bad value X-UA-Compatible for attribute http-equiv on element meta.',
				'Element img is missing required attribute src.'
			]
		},
		files: {
			src: '_gh_pages/**/*.html'
		}
	};
}