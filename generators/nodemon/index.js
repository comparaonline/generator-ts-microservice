'use strict';
const _ = require('lodash');
const extend = _.merge;
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  writing() {
    const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    const pkg = extend({
      scripts: {
        'run:dev': 'nodemon .'
      }
    }, currentPkg);

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }

  install() {
    this.npmInstall([
      'nodemon'
    ], { 'save-dev': true });
  }
};
