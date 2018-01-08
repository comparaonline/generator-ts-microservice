'use strict';
const _ = require('lodash');
const extend = _.merge;
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  static get devDependencies() {
    return ['eslint', 'eslint-config-airbnb-base', 'eslint-plugin-import'];
  }
  writing() {
    this.fs.copy(
      this.templatePath('.eslintrc'),
      this.destinationPath('.eslintrc')
    );
    const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    const pkg = extend({
      scripts: {
        eslint: 'eslint "**/*.js"',
        pretest: 'yarn eslint',
      }
    }, currentPkg);

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }
};
