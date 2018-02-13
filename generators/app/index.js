'use strict';
const path = require('path');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const Generator = require('yeoman-generator');
const yosay = require('yosay');
const _ = require('lodash');
const extend = _.merge;

module.exports = class extends Generator {
  initializing() {
    this.props = {};
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
  }

  prompting() {
    this.log(yosay(`Let's setup your new ${chalk.red('ComparaOnline')} microservice!`));
    const prompts = [
      {
        name: 'name',
        message: 'Your microservice name',
        default: path.basename(process.cwd()),
        filter: name => name.toLowerCase().replace(/\s+|_/, '-')
      },
      {
        name: 'testFramework',
        message: 'Choose the test framework you want to use',
        type: 'list',
        default: '../mocha',
        choices: [
          {
            name: 'Mocha + Chai',
            value: '../mocha'
          },
          {
            name: `Jest (${chalk.red('NOT RECOMMENDED!!!!')})`,
            value: '../jest'
          }
        ]
      },
      {
        name: 'optionalDependencies',
        message: 'Select which optional dependencies you need installed',
        type: 'checkbox',
        choices: [
          {
            name: 'Sequelize ORM',
            value: '../sequelize',
            checked: (this.pkg.dependencies || {}).sequelize !== undefined
          },
          {
            name: 'Event Streamer (Kafka framework)',
            value: '../event-streamer',
            checked: (this.pkg.dependencies || {})['event-streamer'] !== undefined
          }
        ]
      }
    ];
    return this.prompt(prompts).then(props => {
      this.props = extend(this.props, props);
    });
  }

  default() {
    this.props.githubAccount = 'comparaonline';
    this.props.keywords = ['comparaonline', 'microservice']

    this._checkPath();
    const dependencies = [
      '../node',
      '../base-structure',
      '../jest',
      '../nodemon',
      '../typescript',
      '../tslint',
      '../node-config',
      '../server-express',
      '../docker',
      '../circle',
      '../kubernetes',
      'generator-node/generators/editorconfig',
      'generator-node/generators/git'
    ];
    this.props.dependencies = dependencies
      .concat(this.props.testFramework)
      .concat(this.props.optionalDependencies)
      .map(require.resolve);
    this.props.dependencies
      .forEach(dependency => this.composeWith(dependency, this.props));
  }

  _checkPath() {
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        `Your microservice must be inside a folder named ${this.props.name}\n` +
        "I'll automatically create this folder."
      );
      mkdirp.sync(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
  }

  install() {
    const modules = this.props.dependencies
      .map(require);
    const dependencies = modules
      .filter(dep => dep.dependencies)
      .map(dep => dep.dependencies)
      .reduce((a, b) => a.concat(b), []);

    const devDependencies = modules
      .filter(dep => dep.devDependencies)
      .map(dep => dep.devDependencies)
      .reduce((a, b) => a.concat(b), []);
    this.yarnInstall(dependencies);
    this.yarnInstall(devDependencies, {dev: true});
  }
};
