'use strict';
const _ = require('lodash');
const extend = _.merge;
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  writing() {
    this.fs.copy(
      this.templatePath('.eslintrc'),
      this.destinationPath('.eslintrc')
    );
    const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    const pkg = extend({
      scripts: {
        eslint: 'eslint "**/*.js"',
        pretest: 'npm run eslint',
      }
    }, currentPkg);

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }

  install() {
    this.npmInstall([
      'eslint', 'eslint-config-airbnb-base', 'eslint-plugin-import'
    ], { 'save-dev': true });
  }
};
