'use strict';
const Generator = require('yeoman-generator');
const addScript = require('../../helpers/add-script');

module.exports = class extends Generator {
  static get devDependencies() {
    return ['jest', '@types/jest', 'ts-jest'];
  }
  writing() {
    addScript(this, 'test', 'jest');

    this.fs.copy(
      this.templatePath('jest.config.js'),
      this.destinationPath('jest.config.js')
    );
  }
};
