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
    this.fs.copyTpl(
      this.templatePath('Jenkinsfile'),
      this.destinationPath('Jenkinsfile'),
      {
        microserviceName: this.options.name
      }
    );
  }
};
