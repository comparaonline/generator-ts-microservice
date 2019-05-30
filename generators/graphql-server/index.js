'use strict';
const _ = require('lodash');
const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');
const extend = _.merge;
const { fail } = require('assert');

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
    mkdirp.sync(this.destinationPath('src/graphql-server/resolvers/queries/__tests__'));


    this.fs.copy(
      this.templatePath('graphql-server/index.ts'),
      this.destinationPath('src/graphql-server/index.ts')
    );
    this.fs.copy(
      this.templatePath('graphql-server/schema'),
      this.destinationPath('src/graphql-server/schema')
    );
    this.fs.copy(
      this.templatePath('graphql-server/resolvers/index.ts'),
      this.destinationPath('src/graphql-server/resolvers/index.ts')
    );
    this.fs.copy(
      this.templatePath('graphql-server/resolvers/queries/index.ts'),
      this.destinationPath('src/graphql-server/resolvers/queries/index.ts')
    );
    this.fs.copy(
      this.templatePath('graphql-server/resolvers/queries/test.ts'),
      this.destinationPath('src/graphql-server/resolvers/queries/test.ts')
    );
    try {
      this.fs.copy(
        this.templatePath(`graphql-server/resolvers/queries/__tests__/test.${this._testFramework()}.ts`),
        this.destinationPath('src/graphql-server/resolvers/queries/__tests__/test.test.ts')
      );
    } catch(e) {
      this.log.error(`Error!!! ${e.message}`);
    }
  }
  _testFramework() {
    return ['mocha', 'jest'].find(fw => this.options.hasDependency(fw))
      || fail('No test framework defined');
  }
};
