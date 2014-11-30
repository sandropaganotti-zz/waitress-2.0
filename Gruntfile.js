module.exports = function(grunt){

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    nodemon: {
      dev: {
        script: 'server/app.js',
        options: {
          watch: ['server'],
          callback: function(nodemon){
            nodemon.on('restart', function(){
              require('fs').writeFileSync('tmp/.rebooted','rebooted');
            });
          }
        }
      },
      dist: {
        script: 'server/app.js',
        options: {
          env: {
            NODE_ENV: 'dist'
          }
        }
      }
    },

    mochaTest: {
      test: {
        src: ['server/test/**/*.js'],
        options: {
          reporter: 'spec'
        }
      }
    },

    mocha:{
      test: {
        src: ['client/test/runner.html'],
        options: {
          run: true,
          log: true
        }
      }
    },

    watch: {
      serverTest: {
        files: ['server/**/*'],
        tasks: ['mochaTest']
      },
      clientTest: {
        files: ['client/**/*','!client/bower_components/**'],
        tasks: ['mocha']
      },
      buildSass: {
        files: ['client/scss/**/*','!client/bower_components/**'],
        tasks: ['sass:dev']
      },
      livereload:{
        files: ['client/**/*','tmp/.rebooted','!client/bower_components/**'],
        options:{
          livereload: true
        }
      }
    },

    concurrent: {
      dev: {
        tasks: ['nodemon:dev','watch'],
        options:{
          logConcurrentOutput: true
        }
      }
    },

    sass:{
      dev: {
        files: {
          'client/css/app.css': 'client/scss/main.scss',
          'client/css/kitchen.css': 'client/scss/kitchen.scss'
        }
      },
      dist: {
        files: {
          'client-dist/css/app.css': 'client/scss/main.scss',
          'client-dist/css/kitchen.css': 'client/scss/kitchen.scss'
        },
        options: {
          style: 'compressed'
        }
      }
    },

    ngAnnotate:{
      dist: {
        files: {
          'tmp/client/app.js': [
            'client/scripts/app.js',
            'client/scripts/services/*.js',
            'client/scripts/directives/*.js',
            'client/scripts/controllers/*.js'
          ],
          'tmp/client/kitchen.js': [
            'client/scripts/kitchen.js'
          ]
        }
      }
    },

    ngtemplates:  {
      dist: {
        cwd: 'client/',
        src: 'views/**.html',
        dest: 'tmp/client/template.js',
        options: {
          module: 'waitressApp',
          htmlmin: {
            collapseBooleanAttributes:      true,
            collapseWhitespace:             true,
            removeAttributeQuotes:          true,
            removeComments:                 true,
            removeEmptyAttributes:          true,
            removeRedundantAttributes:      true,
            removeScriptTypeAttributes:     true,
            removeStyleLinkTypeAttributes:  true
          }
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'client-dist/scripts/vendor.js': [
            'client/bower_components/ionic/release/js/ionic.js',
            'client/bower_components/angular/angular.js',
            'client/bower_components/angular-animate/angular-animate.js',
            'client/bower_components/angular-sanitize/angular-sanitize.js',
            'client/bower_components/angular-ui-router/release/angular-ui-router.js',
            'client/bower_components/ionic/release/js/ionic-angular.js',
            'client/bower_components/angular-resource/angular-resource.js',
            'client/bower_components/angular-route/angular-route.js',
            'client/scripts/vendor/primus.js'
          ],
          'client-dist/scripts/main.js': [
            'tmp/client/app.js',
            'tmp/client/template.js'
          ],
          'client-dist/scripts/kitchen.js': [
            'client/bower_components/jquery/dist/jquery.js',
            'client/bower_components/bootstrap-sass/dist/js/bootstrap.js',
            'client/bower_components/underscore/underscore.js',
            'client/bower_components/angular/angular.js',
            'tmp/client/kitchen.js'
          ]
        }
      }
    },

    processhtml: {
      dist: {
        files: {
          'client-dist/index.html': ['client/index.html'],
          'client-dist/kitchen.html': ['client/kitchen.html']
        }
      }
    }

  });

  grunt.registerTask('default',['concurrent']);
  grunt.registerTask('build',['sass:dist', 'ngAnnotate', 'ngtemplates', 'uglify', 'processhtml' ]);

}
