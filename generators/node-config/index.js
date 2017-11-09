'use strict';
const _ = require('lodash');
const extend = _.merge;
const mkdirp = require('mkdirp');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);
    this.option('name', {
      type: String,
      required: true,
      desc: 'Project name'
    });
  }

  writing() {
    mkdirp.sync('config');
    const envs = ['default', 'development', 'qc', 'staging', 'production'];
    envs.forEach(env => this.fs.copyTpl(
      this.templatePath(`${env}.json`),
      this.destinationPath(`config/${env}.json`),
      {
        microserviceName: this.options.name
      }
    ));
  }

  install() {
    this.yarnInstall([ 'config' ]);
    this.yarnInstall([ '@types/config' ], { dev: true });
  }
};
