'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      all: ['lib/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
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
