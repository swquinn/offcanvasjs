'use strict';

module.exports = function jscs(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-jscs');

	return {
		options: {
			config: '.jscsrc',
		},
		grunt: {
			files: {
				src: ['Gruntfile.js', 'grunt/*.js']
			}
		},
		source: {
			files: {
				src: 'js/*.js'
			}
		},
		test: {
			files: {
				src: 'js/tests/unit/*.js'
			}
		}
	}
}