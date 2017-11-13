'use strict';
const _ = require('lodash');
const extend = _.merge;
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  writing() {
    const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    const pkg = extend({
      scripts: {
        sequelize: 'sequelize'
      }
    }, currentPkg);

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }

  install() {
    this.yarnInstall(['sequelize', 'sequelize-cli', 'sequelize-typescript']);
    return this.spawnCommand('yarn', [
      'sequelize',
      'init',
      '--seeders-path', 'src/seeders'
    ]);
  }
};
