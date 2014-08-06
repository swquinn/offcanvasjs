'use strict';

module.exports = function connect(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-contrib-connect');
	
	return {
		server: {
			options: {
				port: 3000,
				base: '.'
			}
		}
	};
}