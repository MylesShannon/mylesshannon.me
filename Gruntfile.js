module.exports = function(grunt) {
  var rewrite = require('connect-modrewrite');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      dist: {
        files: [
          {src: 'src/analytics.js', dest: 'dist/analytics.js'},
          {src: 'src/robots.txt', dest: 'dist/robots.txt'},
          {src: 'src/me.jpg', dest: 'dist/me.jpg'}
        ],
      },
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        report: 'min',
        mangle: {
          except: ['jQuery']
        }
      },
      dist: {
        files: {
          'dist/scripts.min.js': ['src/scripts.js']
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
      files: ['Gruntfile.js', 'src/styles.js'],
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
    bower: {
      dist: {
        options: {
          layout: 'byComponent',
          targetDir: './dist/libs'
        }
      }
    },
    clean: {
      folder: '.tmp/'
    },
    postcss: {
      options: {
        map: false,
        processors: [
          require('pixrem')(),
          require('autoprefixer')({browsers: 'last 3 versions'}),
          require('cssnano')()
        ]
      },
      dist: {
        src: 'src/styles.css',
        dest: 'dist/styles.min.css'
      }
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
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-postcss');


  grunt.registerTask('test', ['jshint']); // test all app JS files and the Gruntfiles.js

  grunt.registerTask('serve', ['build:dev', 'connect', 'watch']); // build /src, then host a web server @ localhost:9000 w/ /dist, then build /src agian on file change

  grunt.registerTask('default', ['build:dev', 'connect:dist:keepalive']); // build /src, then open a web server @ localhoset:9000 w/ /dist

  grunt.registerTask('build', function(target) {
    if(target === undefined) {
      target = 'dev'; // build target dev if not otherwise specified
    }
    grunt.task.run([
      'bower', // install all bower libraries into /dist/libs
      'copy', // copy analytics.js nad robots.txt to /dist
      'uglify:dist', // uglify app JS
      'htmlbuild:'+target, // add analytics.js to html if target is 'dist'
      'postcss', // autoprefix for last 3 versions of web browsers and minify custome styles.css
      'htmlmin', // minify html, including index.html & partials & directives
      'clean' // remove /.tmp directory
    ]);
  });

};