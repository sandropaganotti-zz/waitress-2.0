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
          'client-dist/app.css': 'client/scss/app.scss'
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
            'client/js/app.js',
            'client/js/resources/*.js',
            'client/js/directives/*.js',
            'client/js/controllers/*.js'
          ]
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'client-dist/app.js': [
            'client/components/angular/angular.js',
            'client/components/angular-resource/angular-resource.js',
            'tmp/client/app.js'
          ]
        }
      }
    },

    processhtml: {
      dist: {
        files: {
          'client-dist/index.html': ['client/index.html']
        }
      }
    }

  });

  grunt.registerTask('default',['concurrent']);
  grunt.registerTask('build',['ngAnnotate','uglify','sass:dist','processhtml']);

}
