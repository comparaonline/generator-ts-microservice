'use strict';
const _ = require('lodash');
const extend = _.merge;
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  static get devDependencies() {
    return ['jest', '@types/jest', 'ts-jest'];
  }
  writing() {
    const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    const pkg = extend({
      scripts: {
        test: 'jest',
        coverage: 'jest --coverage --coverageReporters html'
      },
      jest: {
        forceExit: true,
        mapCoverage: true,
        collectCoverageFrom: [
          'src/**/*.{ts?(x),js?(x)}',
          '!src/**/*.d.ts',
          '!src/**/__tests__/**/*.*'
        ],
        moduleFileExtensions: [
          'ts',
          'tsx',
          'js'
        ],
        setupFiles: [
          './src/initialization/index.ts'
        ],
        testEnvironment: "node",
        transform: {
          '\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js'
        },
        testRegex: 'src(/.*)?/__tests__/[^/]*\\.(ts|tsx|js)$'
      }
    }, currentPkg);

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

    this.fs.copy(
      this.templatePath('docker-compose.test.yml'),
      this.destinationPath('docker-compose.test.yml')
    )
  }
};
