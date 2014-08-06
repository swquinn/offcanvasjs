'use strict';

module.exports = function uglify(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-contrib-uglify');

	return {
		options: {
			report: 'min'
		},
		dist: {
			options: {
				banner: '<%= banner %>'
			},
			src: '<%= concat.dist.dest %>',
			dest: 'dist/js/<%= pkg.name %>.min.js'
		}
	};
}