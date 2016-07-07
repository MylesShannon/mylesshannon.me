module.exports = function(grunt) {
  var rewrite = require('connect-modrewrite');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      dist: {
        files: [
          {expand: true, cwd: 'src/', src: 'analytics.js', dest: 'dist/'},
          {expand: true, cwd: 'src/', src: 'robots.txt', dest: 'dist/'}
        ],
      },
    },
    uglify: {
      options: {
        report: 'min',
        soureMap: true,
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/app.min.js': '.tmp/app.min.js'
        }
      }
    },
    connect: {
      dist: {
        options: {
          port: 9000,
          hostname: '0.0.0.0',
          open: true,
          base: 'dist/',
          middleware: function(connect, options, middlewares) {
            var rules = [
                '!\\.html|\\.woff|\\.eot|\\.ttf|\\.js|\\.css|\\.svg|\\.jp(e?)g|\\.png|\\.gif$ /index.html'
            ];
            middlewares.unshift(rewrite(rules));
            middlewares.unshift(require('connect-livereload')());
            return middlewares;
          }
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/app/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeComments: true
        },
        files: [
          {expand: true, cwd: 'src/views', src: '**/*.html', dest: 'dist/views/'},
          {src: '.tmp/index.html', dest: 'dist/index.html'},
        ]
      }
    },
    less: {
      dist: {
        files: {
          '.tmp/bootstrap.css': 'src/less/bootstrap/bootstrap.less',
          '.tmp/font-awesome.css': 'src/less/font-awesome/font-awesome.less'
        }
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      dist: {
        files: {
          'dist/styles.min.css': ['.tmp/bootstrap.css', '.tmp/font-awesome.css', 'src/styles.css']
        }
      }
    },
    htmlbuild: {
      dev: {
        src: 'src/index.html',
        dest: '.tmp/',
        options: {
          scripts: {
            analytics: []
          }
        }
      },
      dist: {
        src: 'src/index.html',
        dest: '.tmp/',
        options: {
          beautify: true,
          relative: false,
          scripts: {
            'analytics': {
              cwd: 'dist/',
              files: [
                'analytics.js'
              ]
            }
          }
        }
      }
    },
    watch: {
      dist: {
        tasks: ['build:dev'],
        files: ['Gruntfile.js', 'src/**'],
        options: {
          livereload: true
        }
      }
    },
    ngAnnotate: {
        options: {
            singleQuotes: true
        },
        dist: {
            files: {
              '.tmp/app.min.js':'src/app/*.js'
            }
        },
    },
    bower: {
      dist: {
        options: {
          install: false,
          targetDir: './dist/libs'
        }
      }
    },
    clean: {
      folder: '.tmp/'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-html-build');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-jasmine');


  grunt.registerTask('test', ['jshint']); // test all app JS files and the Gruntfiles.js

  grunt.registerTask('serve', ['build:dev', 'connect', 'watch']); // build /src, then host a web server @ localhost:9000 w/ /dist, then build /src agian on file change

  grunt.registerTask('default', ['build:dev', 'connect:dist:keepalive']); // build /src, then open a web server @ localhoset:9000 w/ /dist

  grunt.registerTask('build', function(target) {
    if(target === undefined) {
      target = 'dev'; // build target dev if not otherwise specified
    }
    grunt.task.run([
      'bower', // install all bower libraries into /dist/libs
      'less', // compile bootstrap & flat-ui less
      'copy', // copy analytics.js nad robots.txt to /dist
      'ngAnnotate', // annotate Angular app code to properly uglify
      'uglify', // uglify app JS
      'htmlbuild:'+target, // add analytics.js to html if target is 'dist'
      'cssmin', // minify less and styles.css
      'htmlmin', // minify html, including index.html & partials & directives
      'clean' // remove /.tmp directory
    ]);
  });

};