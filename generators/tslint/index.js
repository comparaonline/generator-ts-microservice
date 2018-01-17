'use strict';
const _ = require('lodash');
const extend = _.merge;
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  static get devDependencies() {
    return ['tslint', 'tslint-config-airbnb'];
  }
  writing() {
    this.fs.copy(
      this.templatePath('tslint.json'),
      this.destinationPath('tslint.json')
    );
    const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    const pkg = extend({
      scripts: {
        tslint: 'tslint -c tslint.json -p tsconfig.json',
        pretest: 'yarn tslint',
      }
    }, currentPkg);

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }
};
