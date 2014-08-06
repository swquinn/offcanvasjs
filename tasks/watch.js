'use strict';

module.exports = function watch(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-contrib-watch');

	return {
		src: {
			files: '<%= jshint.src.src %>',
			tasks: ['jshint:src', 'qunit']
		},
		test: {
			files: '<%= jshint.test.src %>',
			tasks: ['jshint:test', 'qunit']
		},
		less: {
			files: 'less/*.less',
			tasks: 'less'
		}
	};
}