'use strict';
const Generator = require('yeoman-generator');
const yamlHelper = require('../../helpers/yaml-helper');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);
    this.option('name', {
      type: String,
      required: true,
      desc: 'Project name'
    });
    this.option('optionalDependencies', {
      type: Array,
      required: false,
      desc: 'Selected optional dependencies'
    });
    yamlHelper(this);
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
        microserviceName: this.options.name,
        additionalParts: this._additionalParts()
      }
    );
  }

  _additionalParts() {
    const additionalParts = [];
    if (this._includeSequelize()) {
      const sequelize = this.fs.read(this.templatePath('Dockerfile-sequelize'));
      additionalParts.push(sequelize);
    }
    return additionalParts.join('\n')
  }

  _includeSequelize() {
    return !!this.options.optionalDependencies
      .reduce((a, b) => a.concat(b), [])
      .find(elem => elem.indexOf('sequelize') !== -1) || false;
  }
};
