'use strict';

module.exports = function cssmin(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	
	return {
		compress: {
			options: {
				keepSpecialComments: '*',
				noAdvanced: true, // turn advanced optimizations off until the issue is fixed in clean-css
				report: 'min',
				compatibility: 'ie8'
			},
			src: [
				'docs/assets/css/docs.css',
				'docs/assets/css/pygments-manni.css'
			],
			dest: 'docs/assets/css/docs.min.css'
		}
	};
}