'use strict';
const path = require('path');
const chalk = require('chalk');
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
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        `Your microservice must be inside a folder named ${this.props.name}\n` +
        "I'll automatically create this folder."
      );
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
    this.composeWith(require.resolve('../node'), {
      name: this.props.name
    });
    this.composeWith(require.resolve('../eslint'));
    this.composeWith(require.resolve('../jest'));
    this.composeWith(require.resolve('../nodemon'));
  }

  writing() {
    // this.fs.copy(
    //   this.templatePath('dummyfile.txt'),
    //   this.destinationPath('dummyfile.txt')
    // );
  }

  install() {
    this.npmInstall();
  }
};
