'use strict';
const _ = require('lodash');
const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');
const extend = _.merge;

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
    this.fs.copyTpl(
      this.templatePath('index.ts'),
      this.destinationPath('src/index.ts'),
      {
        microserviceName: this.options.name
      }
    );

    mkdirp.sync('src/routes');

    this.fs.copy(
      this.templatePath('routes/index.ts'),
      this.destinationPath('src/routes/index.ts')
    );
    this.fs.copy(
      this.templatePath('routes/test.ts'),
      this.destinationPath('src/routes/test.ts')
    )
  }

  install() {
    this.yarnInstall(['express', 'express-healthcheck', 'morgan']);
    this.yarnInstall(['@types/express', '@types/morgan'], { 'dev': true });
  }
};
