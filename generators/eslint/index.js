'use strict';
const Generator = require('yeoman-generator');
const addScript = require('../../helpers/add-script');

module.exports = class extends Generator {
  static get devDependencies() {
    return ['eslint', 'eslint-config-airbnb-base', 'eslint-plugin-import'];
  }
  writing() {
    this.fs.copy(
      this.templatePath('.eslintrc'),
      this.destinationPath('.eslintrc')
    );
    addScript(this, 'eslint', 'eslint "**/*.js"');
    addScript(this, 'pretest', 'yarn eslint');
  }
};
