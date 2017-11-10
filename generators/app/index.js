'use strict';
const path = require('path');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const Generator = require('yeoman-generator');
const yosay = require('yosay');

module.exports = class extends Generator {
  initializing() {
    this.props = {};
  }

  prompting() {
    this.log(yosay(`Let's setup your new ${chalk.red('ComparaOnline')} microservice!`));

    return this.prompt({
      name: 'name',
      message: 'Your microservice name',
      default: path.basename(process.cwd()),
      filter: name => name.toLowerCase().replace(/\s+|_/, '-')
    }, this).then(props => {
      this.props.name = props.name;
      });
  }

  default() {
    this.props.githubAccount = 'comparaonline';
    this.props.keywords = 'comparaonline, microservice'

    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        `Your microservice must be inside a folder named ${this.props.name}\n` +
        "I'll automatically create this folder."
      );
      mkdirp.sync(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
    const dependencies = [
      '../node',
      '../jest',
      '../nodemon',
      '../typescript',
      '../tslint',
      '../node-config',
      '../server-express',
      '../docker',
      'generator-node/generators/editorconfig',
      'generator-node/generators/git'
    ];
    dependencies
      .map(require.resolve)
      .forEach(dependency => this.composeWith(dependency, this.props));
  }

  install() {
    this.yarnInstall();
  }
};
