'use strict';
const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');
const addScript = require('../../helpers/add-script');

module.exports = class extends Generator {
  static get dependencies() {
    return ['reflect-metadata'];
  }

  static get devDependencies() {
    return ['typescript', 'ts-node'];
  }

  writing() {
    mkdirp('src');
    mkdirp('build');
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('build/.gitignore')
    );
    this.fs.copy(
      this.templatePath('tsconfig.json'),
      this.destinationPath('tsconfig.json')
    );

    addScript(this, 'compile', 'tsc');
    addScript(this, 'clean', 'rm -rf build/*');
    addScript(this, 'start', 'node build');
    addScript(this, 'start:dev', 'TS_NODE_FILES=true node --inspect=9000 -r ts-node/register src/index.ts');
  }
};
