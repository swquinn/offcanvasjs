'use strict';

module.exports = function exec(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-exec');

	return {
		npmUpdate: {
			command: 'npm update'
		},
		npmShrinkWrap: {
			command: 'npm shrinkwrap --dev'
		}
	};
}