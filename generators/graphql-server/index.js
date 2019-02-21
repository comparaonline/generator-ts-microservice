'use strict';
const _ = require('lodash');
const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');
const extend = _.merge;

module.exports = class extends Generator {
  static get dependencies() {
    return ['apollo-server-express', 'graphql', 'graphql-tag', 'graphql-tools'];
  }

  static get devDependencies() {
    return ['@types/graphql'];
  }

  static get registerServer() {
    return './graphql-server';
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
      this.templatePath('graphql-server'),
      this.destinationPath('src/graphql-server')
    );
  }
};
