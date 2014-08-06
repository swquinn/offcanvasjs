'use strict';

module.exports = function concat(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-contrib-concat');
	
	return {
		options: {
			banner: '<%= banner %>\n<%= jqueryCheck %>',
			stripBanners: false
		},
		dist: {
			src: [ 'js/offcanvas.js' ],
			dest: 'dist/js/<%= pkg.name %>.js'
		}
	};
}