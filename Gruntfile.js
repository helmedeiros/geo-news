'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      lib: {
        files: { src: ['lib/**/*.js', 'test/**/*.js'] },
        options: { jshintrc: '.jshintrc' }
      },
      web: {
        files: { src: ['web/js/**/*.js'] },
        options: { jshintrc: 'web/.jshintrc' }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.test.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('check', ['jshint', 'mochaTest']);
  grunt.registerTask('default', ['check']);
};
