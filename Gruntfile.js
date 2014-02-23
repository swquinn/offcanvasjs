/*!
 * OffcanvasJS's Gruntfile
 * https://github.com/swquinn/offcanvasjs
 * Copyright 2014 Extesla Digital, LLC.
 * Licensed under MIT (https://github.com/swquinn/offcanvasjs/blob/master/LICENSE)
 */

module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  RegExp.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  var fs = require('fs');
  var path = require('path');

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
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
			' */\n',
    jqueryCheck: 'if (typeof jQuery === \'undefined\') { throw new Error(\'Offcanvas\\\'s JavaScript requires jQuery\') }\n\n',

    // Task configuration.
    clean: {
      dist: ['dist', 'docs/dist']
    },

    jshint: {
      options: {
        jshintrc: 'js/.jshintrc'
      },
      grunt: {
        options: {
          jshintrc: 'grunt/.jshintrc'
        },
        src: ['Gruntfile.js', 'grunt/*.js']
      },
      src: {
        src: 'js/*.js'
      },
      test: {
        src: 'js/tests/unit/*.js'
      }
    },

    jscs: {
      options: {
        config: 'js/.jscs.json',
      },
      grunt: {
        src: ['Gruntfile.js', 'grunt/*.js']
      },
      src: {
        src: 'js/*.js'
      },
      test: {
        src: 'js/tests/unit/*.js'
      }
    },

    csslint: {
      options: {
        csslintrc: 'less/.csslintrc'
      },
      src: [
        'dist/css/offcanvas.css',
        'docs/assets/css/docs.css',
        'docs/examples/**/*.css'
      ]
    },

    concat: {
      options: {
        banner: '<%= banner %>\n<%= jqueryCheck %>',
        stripBanners: false
      },
      dist: {
        src: [
          'js/offcanvas.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
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
    },

    less: {
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
    },

    cssmin: {
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
    },

    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= banner %>'
        },
        files: {
          src: [
            'dist/css/<%= pkg.name %>.css',
            'dist/css/<%= pkg.name %>.min.css',
            'dist/css/<%= pkg.name %>-theme.css',
            'dist/css/<%= pkg.name %>-theme.min.css'
          ]
        }
      }
    },

    csscomb: {
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
    },

    copy: {
      fonts: {
        expand: true,
        src: 'fonts/*',
        dest: 'dist/'
      },
      docs: {
        expand: true,
        cwd: './dist',
        src: [
          '{css,js}/*.min.*',
          'css/*.map',
          'fonts/*'
        ],
        dest: 'docs/dist'
      }
    },

	/*
    qunit: {
      options: {
        inject: 'js/tests/unit/phantom.js'
      },
      files: 'js/tests/index.html'
    },
	*/

    connect: {
      server: {
        options: {
          port: 3000,
          base: '.'
        }
      }
    },

    jekyll: {
      docs: {}
    },

    validation: {
      options: {
        charset: 'utf-8',
        doctype: 'HTML5',
        failHard: true,
        reset: true,
        relaxerror: [
          'Bad value X-UA-Compatible for attribute http-equiv on element meta.',
          'Element img is missing required attribute src.'
        ]
      },
      files: {
        src: '_gh_pages/**/*.html'
      }
    },

    watch: {
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
    },

    sed: {
      versionNumber: {
        pattern: (function () {
          var old = grunt.option('oldver');
          return old ? RegExp.quote(old) : old;
        })(),
        replacement: grunt.option('newver'),
        recursive: true
      }
    },

    exec: {
      npmUpdate: {
        command: 'npm update'
      },
      npmShrinkWrap: {
        command: 'npm shrinkwrap --dev'
      }
    }
  });


  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  // Docs HTML validation task
  grunt.registerTask('validate-html', ['jekyll', 'validation']);

  // Test task.
  var testSubtasks = [];
  // Skip core tests if running a different subset of the test suite
  if (!process.env.OFFCANVAS_TEST || process.env.OFFCANVAS_TEST === 'core') {
    testSubtasks = testSubtasks.concat(['dist-css', 'csslint', 'jshint', 'jscs', 'qunit']);
  }
  // Skip HTML validation if running a different subset of the test suite
  if (!process.env.OFFCANVAS_TEST || process.env.OFFCANVAS_TEST === 'validate-html') {
    testSubtasks.push('validate-html');
  }
  grunt.registerTask('test', testSubtasks);

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['less', 'cssmin', 'csscomb', 'usebanner']);

  // Docs distribution task.
  grunt.registerTask('dist-docs', 'copy:docs');

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'dist-css', 'copy:fonts', 'dist-js', 'dist-docs']);

  // Default task.
  grunt.registerTask('default', [/*'test', */ 'dist']);

  // Version numbering task.
  // grunt change-version-number --oldver=A.B.C --newver=X.Y.Z
  // This can be overzealous, so its changes should always be manually reviewed!
  grunt.registerTask('change-version-number', 'sed');
};
