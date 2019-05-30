'use strict';
const path = require('path');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const Generator = require('yeoman-generator');
const yosay = require('yosay');
const _ = require('lodash');
const extend = _.merge;

const getOr = (name, def = false) => obj =>
  obj && obj[name] !== undefined ? obj[name] : def;

const deps = (dev = false) => dev ? 'devDependencies' : 'dependencies';
const checker = json => (name, dev = false) => _.flow([getOr(deps(dev)), getOr(name)])(json);
const optionChecker = checker => (options, dev = false) =>
  (Object.entries(options).find(([k, v]) => checker(k, dev)) || [])[1];

module.exports = class extends Generator {
  initializing() {
    this.props = {};
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
  }

  prompting() {
    this.log(yosay(`Let's setup your new ${chalk.red('ComparaOnline')} microservice!`));

    const installed = checker(this.pkg);
    const options = optionChecker(installed);
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
        default: options({ mocha: '../mocha', jest: '../jest' }, true),
        choices: [
          {
            name: 'Mocha + Chai',
            value: '../mocha'
          },
          {
            name: 'Jest',
            value: '../jest'
          }
        ]
      },
      {
        name: 'ciPlatform',
        message: 'Choose the CI platform you want to use',
        type: 'list',
        default: '../jenkins',
        choices: [
          {
            name: 'Jenkins',
            value: '../jenkins'
          },
          {
            name: `CircleCI (${chalk.red('We are deprecating support for circle!!!')})`,
            value: '../circle'
          }
        ]
      },
      {
        name: 'optionalDependencies',
        message: 'Select which optional dependencies you need installed',
        type: 'checkbox',
        choices: [
          {
            name: 'TypeORM',
            value: '../typeorm',
            checked: installed('typeorm')
          },
          {
            name: `Sequelize ORM (${chalk.red('We should not use it anymore')})`,
            value: '../sequelize',
            checked: installed('sequelize')
          },
          {
            name: 'Event Streamer (Kafka framework)',
            value: '../event-streamer',
            checked: installed('@comparaonline/event-streamer')
          },
          {
            name: 'Graphql Server',
            value: '../graphql-server',
            checked: installed('graphql')
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
    const dependencies = this._dependencies();
    const resolved = dependencies.map(require.resolve);

    this.props.dependencies = resolved.map(require)
    this.props.hasDependency = name => dependencies
      .map(v => v.replace(/.*\/([^\/]+)/, '$1'))
      .includes(name);

    resolved.forEach(dependency => this.composeWith(dependency, this.props));
  }

  _dependencies() {
    return [
      '../node',
      '../base-structure',
      '../nodemon',
      '../typescript',
      '../tslint',
      '../node-config',
      '../server-express',
      '../docker',
      '../kubernetes',
      '../raven',
      '../datadog',
      'generator-node/generators/editorconfig',
      'generator-node/generators/git',
      this.props.ciPlatform,
      this.props.testFramework,
      ...this.props.optionalDependencies
    ];
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
    const dependencies = this.props.dependencies
      .filter(dep => dep.dependencies)
      .map(dep => dep.dependencies)
      .reduce((a, b) => [...a, ...b]);

    const devDependencies = this.props.dependencies
      .filter(dep => dep.devDependencies)
      .map(dep => dep.devDependencies)
      .reduce((a, b) => [...a, ...b]);
    this.yarnInstall(dependencies);
    this.yarnInstall(devDependencies, { dev: true });
  }
};
