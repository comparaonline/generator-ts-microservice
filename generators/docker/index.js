'use strict';
const Generator = require('yeoman-generator');

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
    this.fs.copy(
      this.templatePath('docker-compose.yml'),
      this.destinationPath('docker-compose.yml')
    );

    this.fs.copy(
      this.templatePath('.dockerignore'),
      this.destinationPath('.dockerignore')
    );

    this.fs.copyTpl(
      this.templatePath('Dockerfile'),
      this.destinationPath('Dockerfile'),
      {
        microserviceName: this.options.name
      }
    );
  }
};
