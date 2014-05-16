/*jshint unused:false */
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // configurable paths
  var yeomanConfig = {
    src: 'src',
    dist: 'dist',
    test: 'test',
    temp: '.temp'
  };

  var bower = grunt.file.readJSON('bower.json');

  try {
    yeomanConfig.src = bower.appPath || yeomanConfig.src;
  } catch (e) {}

  grunt.initConfig({

    yeoman: yeomanConfig,

    bower: bower,

    util: {
      getAuthors: function(authors) {
        var authorsString = '';
        for (var a in authors) {
          if (authors[a].name) {
            authorsString += authors[a].name;
          }
          if (authors[a].email) {
            authorsString += ' (' + authors[a].email + '), ';
          }
        }
        authorsString = authorsString.substring(0, authorsString.length - 2);
        return authorsString;
      }
    },

    meta: {
      banner:
        '/**\n' +
        ' * <%= bower.name %>\n' +
        ' * @version v<%= bower.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * @author <%= util.getAuthors(bower.authors) %>\n' +
		    ' * @link <%= bower.homepage %>\n' +
        ' * @license <%= bower.license.join(", ") %>\n' +
        '**/\n\n'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.src %>/**/*.js'
      ],
      test: {
        src: ['<%= yeoman.test %>/spec/**/*.js'],
        options: {
          jshintrc: '<%= yeoman.test %>/.jshintrc'
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      temp: {
        src: ['<%= yeoman.dist %>/<%= yeoman.temp %>']
      }
    },

    // Automatically inject Bower components into the app
    bowerInstall: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath: '<%= yeoman.app %>/'
      }
    },

    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.src %>',
          src: ['**/*.js'],
          dest: '<%= yeoman.dist %>/<%= yeoman.temp %>'
        }]
      }
    },

    // Test settings
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      debug: {
        options: {
          singleRun: false
        }
      },
      unit: {
        browsers: ['PhantomJS'],
        options: {
          singleRun: true
        }
      }
    },

    concat: {
      options: {
        banner: '<%= meta.banner %>\'use strict\';\n',
        process: function(src, filepath) {
          return '// Source: ' + filepath + '\n' +
            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
        }
      },
      dist: {
        src: ['common/*.js', '<%= yeoman.dist %>/<%= yeoman.temp %>/**/*.js'],
        dest: '<%= yeoman.dist %>/<%= bower.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      min: {
        files: {
          '<%= yeoman.dist %>/<%= bower.name %>.min.js': '<%= concat.dist.dest %>'
        }
      }
    }
  });

  // Test the directive
  grunt.registerTask('debug', ['newer:jshint', 'karma:debug']);
  grunt.registerTask('test', ['newer:jshint', 'karma:unit']);

  // Build the directive
  //  - clean, cleans the output directory
  //  - ngmin, prepares the angular files
  //  - concat, concatenates and adds a banner to the debug file
  //  - uglify, minifies and adds a banner to the minified file
  //  - clean:temp, cleans the ngmin-ified directory
  grunt.registerTask('build', ['clean', 'ngmin', 'concat', 'uglify', 'clean:temp']);

  // Default task, do everything
  grunt.registerTask('default', ['test', 'build']);
};
