'use strict';
const _ = require('lodash');
const extend = _.merge;
const mkdirp = require('mkdirp');
const Generator = require('yeoman-generator');

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

    const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    const pkg = extend({
      scripts: {
        compile: 'tsc --outDir ./build',
        clean: 'rm -rf build/*',
        start: 'node ./build',
        watch: 'nodemon -e ts -w ./src -x yarn watch:serve',
        'watch:serve': 'ts-node --inspect src/index.ts'
      }
    }, currentPkg);

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }
};
