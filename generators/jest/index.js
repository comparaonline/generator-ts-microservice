'use strict';
const Generator = require('yeoman-generator');
const addScript = require('../../helpers/add-script');
const extendPackage = require('../../helpers/extend-package');

module.exports = class extends Generator {
  static get devDependencies() {
    return ['jest', '@types/jest', 'ts-jest'];
  }
  writing() {
    addScript(this, 'test', 'jest');
    addScript(this, 'coverage', 'jest --coverage --coverageReporters html');

    extendPackage({
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
    });


    this.fs.copy(
      this.templatePath('docker-compose.test.yml'),
      this.destinationPath('docker-compose.test.yml')
    )
  }
};
