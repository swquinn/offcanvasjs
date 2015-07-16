'use strict';


module.exports = function bower(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-bower-task');

	// Options
	return {
		install: {
			options: {
				targetDir: "dist/vendor",
				layout: "byComponent",
				verbose: true,
				bowerOptions: {
					forceLatest: true,
					production: true
				}
			}
		}
	};
}
