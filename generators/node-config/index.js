'use strict';
const _ = require('lodash');
const extend = _.merge;
const mkdirp = require('mkdirp');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  writing() {
    mkdirp.sync('config');
    const envs = ['default', 'development', 'qc', 'staging', 'production'];
    envs.forEach(env => this.fs.copy(
      this.templatePath(`${env}.json`),
      this.destinationPath(`config/${env}.json`)
    ));
  }

  install() {
    this.yarnInstall([ 'config' ]);
  }
};
