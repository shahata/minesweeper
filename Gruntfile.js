// Generated on 2014-06-26 using generator-wix-angular 0.1.49
'use strict';

module.exports = function (grunt) {
  var unitTestFiles = [];
  require('./karma.conf.js')({set: function (karmaConf) {
    unitTestFiles = karmaConf.files.filter(function (value) {
      return value.indexOf('bower_component') !== -1;
    });
  }});
  require('wix-gruntfile')(grunt, {
    staging: 'pizza',
    port: 9000,
    preloadModule: 'minesweeperApp',
    translationsModule: 'minesweeperTranslations',
    unitTestFiles: unitTestFiles,
    protractor: true
  });
};
