'use strict';

module.exports = function csscomb(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-csscomb');
	
	return {
		options: {
			config: 'less/.csscomb.json'
		},
		dist: {
			files: {
				'dist/css/<%= pkg.name %>.css': 'dist/css/<%= pkg.name %>.css',
				'dist/css/<%= pkg.name %>-theme.css': 'dist/css/<%= pkg.name %>-theme.css'
			}
		},
		examples: {
			expand: true,
			cwd: 'docs/examples/',
			src: ['**/*.css'],
			dest: 'docs/examples/'
		}
	};
}