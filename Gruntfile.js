/*!
 * OffcanvasJS's Gruntfile
 * https://github.com/swquinn/offcanvasjs
 * Copyright 2014 Extesla Digital, LLC.
 * Licensed under MIT (https://github.com/swquinn/offcanvasjs/blob/master/LICENSE)
 */
module.exports = function (grunt) {
	'use strict';

	var fs = require('fs');
	var path = require('path');

	require('time-grunt')(grunt);

	// Load the project's grunt tasks from a directory
	require('grunt-config-dir')(grunt, {
		configDir: require('path').resolve('tasks')
	});

	// Force use of Unix newlines
	grunt.util.linefeed = '\n';

	RegExp.quote = function (string) {
		return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
	};

	// Project configuration.
	grunt.config('pkg', grunt.file.readJSON('package.json')); 
	grunt.config('banner',
		'/*!\n' +
		'/* Copyright (c) 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
		' *\n' +
		' * Licensed under the MIT License (http://opensource.org/licenses/MIT)\n' +
		' *\n' +
		' * Permission is hereby granted, free of charge, to any\n' +
		' * person obtaining a copy of this software and associated\n' +
		' * documentation files (the "Software"), to deal in the\n' +
		' * Software without restriction, including without limitation\n' +
		' * the rights to use, copy, modify, merge, publish,\n' +
		' * distribute, sublicense, and/or sell copies of the Software,\n' +
		' * and to permit persons to whom the Software is furnished\n' +
		' * to do so, subject to the following conditions:\n' +
		' *\n' +
		' * The above copyright notice and this permission notice\n' +
		' * shall be included in all copies or substantial portions of\n' +
		' * the Software.\n' +
		' *\n' +
		' * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY\n' +
		' * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE\n' +
		' * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR\n' +
		' * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS\n' +
		' * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR\n' +
		' * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT\n' +
		' * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE\n' +
		' * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n' +
		' */\n'
	);
	grunt.config('jqueryCheck', 'if (typeof jQuery === \'undefined\') { throw new Error(\'Offcanvas\\\'s JavaScript requires jQuery\') }\n\n');

	// JS distribution task.
	grunt.registerTask('dist-js', ['concat', 'uglify']);

	// CSS distribution task.
	grunt.registerTask('dist-css', ['less', 'cssmin', 'csscomb', 'usebanner']);

	// Docs distribution task.
	grunt.registerTask('dist-docs', 'copy:docs');

	// Full distribution task.
	grunt.registerTask('dist', ['clean', 'bower', 'dist-css', 'copy:fonts', 'dist-js', 'dist-docs']);

	// Default task.
	grunt.registerTask('default', [/*'test', */ 'dist']);

	// Version numbering task.
	// grunt change-version-number --oldver=A.B.C --newver=X.Y.Z
	// This can be overzealous, so its changes should always be manually reviewed!
	grunt.registerTask('change-version-number', 'sed');
};
