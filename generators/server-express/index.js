'use strict';
const _ = require('lodash');
const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');
const extend = _.merge;

module.exports = class extends Generator {
  static get dependencies() {
    return ['express', 'express-healthcheck', 'morgan'];
  }

  static get devDependencies() {
    return ['@types/express', '@types/morgan'];
  }

  static get registerServer() {
    return './web-server';
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
      this.templatePath('web-server'),
      this.destinationPath('src/web-server')
    );
  }
};
