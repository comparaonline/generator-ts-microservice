'use strict';
const _ = require('lodash');
const extend = _.merge;
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  writing() {
    const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    const pkg = extend({
      scripts: {
        test: 'jest',
        coverage: 'jest --mapCoverage --coverage --coverageReporters html'
      },
      jest: {
        moduleFileExtensions: [
          'ts',
          'tsx',
          'js'
        ],
        transform: {
          '\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js'
        },
        testRegex: '/__tests__/.*\\.test.(ts|tsx|js)$'
      }
    }, currentPkg);

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }

  install() {
    this.npmInstall([
      'jest', '@types/jest'
    ], { 'save-dev': true });
  }
};
