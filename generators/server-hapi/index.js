'use strict';
const _ = require('lodash');
const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');
const extend = _.merge;

module.exports = class extends Generator {
  static get dependencies() {
    return ['hapi', 'hapi-alive'];
  }

  static get devDependencies() {
    return ['@types/hapi'];
  }

  constructor(args, options) {
    super(args, options);
    this.option('name', {
      type: String,
      required: true,
      desc: 'Project name'
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath('index.ts'),
      this.destinationPath('src/index.ts')
    );

    mkdirp.sync('src/lib');

    this.fs.copyTpl(
      this.templatePath('lib/startServer.ts'),
      this.destinationPath('src/lib/startServer.ts'),
      {
        microserviceName: this.options.name
      }
    );
  }
};
