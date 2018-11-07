'use strict';
const Generator = require('yeoman-generator');
const addScript = require('../../helpers/add-script');

module.exports = class extends Generator {
  static get devDependencies() {
    return ['tslint', 'tslint-config-airbnb'];
  }
  writing() {
    this.fs.copy(
      this.templatePath('tslint.json'),
      this.destinationPath('tslint.json')
    );
    addScript(this, 'tslint', 'tslint -c tslint.json -p tsconfig.json');
  }
};
