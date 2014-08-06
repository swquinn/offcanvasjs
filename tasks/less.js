'use strict';

module.exports = function less(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-contrib-less');

	return {
		compile: {
			options: {
				strictMath: true,
				sourceMap: true,
				outputSourceFiles: true,
				sourceMapURL: '<%= pkg.name %>.css.map',
				sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
			},
			files: {
			'dist/css/<%= pkg.name %>.css': 'less/offcanvas.less'
			}
		},
		minify: {
			options: {
				cleancss: true,
				report: 'min'
			},
			files: {
			'dist/css/<%= pkg.name %>.min.css': 'dist/css/<%= pkg.name %>.css',
			'dist/css/<%= pkg.name %>-theme.min.css': 'dist/css/<%= pkg.name %>-theme.css'
			}
		}
	};
}