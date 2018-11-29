'use strict';
const Generator = require('yeoman-generator');
const extendPackage = require('../../helpers/extend-package');
const addScript = require('../../helpers/add-script');

module.exports = class extends Generator {
  static get devDependencies() {
    return ['nodemon'];
  }
  writing() {
    addScript(this, 'watch', 'nodemon -x yarn');
    addScript(this, 'watch:cmd', 'nodemon -x');
    extendPackage(this, {
      nodemonConfig: {
        execMap: {
          ts: 'ts-node --files'
        },
        quiet: true,
        ignore: ['build', '.git'],
        ext: 'js,json,ts'
      }
    });
  }
};
