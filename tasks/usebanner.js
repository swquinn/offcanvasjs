'use strict';

module.exports = function usebanner(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-banner');

	return {
		dist: {
			options: {
				position: 'top',
				banner: '<%= banner %>'
			},
			files: {
				src: [
					'dist/css/<%= pkg.name %>.css',
					'dist/css/<%= pkg.name %>.min.css',
					'dist/css/<%= pkg.name %>-theme.css',
					'dist/css/<%= pkg.name %>-theme.min.css'
				]
			}
		}
	};
}