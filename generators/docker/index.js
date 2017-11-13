'use strict';
const YamlGenerator = require('../../helpers/yaml-generator');

module.exports = class extends YamlGenerator {
  constructor(args, options) {
    super(args, options);
    this.option('name', {
      type: String,
      required: true,
      desc: 'Project name'
    });
  }

  writing() {
    const template = this.readYaml(this.templatePath('docker-compose.yml'), {});
    this.extendYaml(
      this.destinationPath('docker-compose.yml'),
      this.templatePath('docker-compose.yml')
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
