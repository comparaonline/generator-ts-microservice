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
    const template = this.readYaml(this.templatePath('docker-compose.yml'));
    this.extendYaml(
      this.destinationPath('docker-compose.yml'),
      this.templatePath('docker-compose.yml')
    );

    this.fs.copy(
      this.templatePath('dockerignore'),
      this.destinationPath('.dockerignore')
    );

    const dockerOptions = this._dockerOptions();

    this.fs.copyTpl(
      this.templatePath('Dockerfile'),
      this.destinationPath('Dockerfile'),
      dockerOptions
    );
  }

  _dockerOptions() {
    const options = {
      microserviceName: this.options.name,
      dependencies: ['bash', 'make', 'g++', 'python'],
      base: [],
      files: [],
      folders: [],
      lastCopies: []
    };
    this._addSequelize(options);
    this._addTypeOrm(options);
    this._addEventStreamer(options);
    return options;
  }

  _addSequelize(options) {
    if (this.options.hasDependency('sequelize')) {
      options.folders = (options.folders || []).concat(['migrations']);
      options.files = (options.files || []).concat(['.sequelizerc']);
    }
  }

  _addTypeOrm(options) {
    if (this.options.hasDependency('typeorm')) {
      options.lastCopies.push(['ormconfig.prod.js', 'ormconfig.js']);
    }
  }

  _addEventStreamer(options) {
    if (this.options.hasDependency('event-streamer')) {
      options.base = (options.base || []).concat([
        'RUN apk --no-cache add ca-certificates \\',
        '  lz4-dev \\',
        '  musl-dev \\',
        '  cyrus-sasl-dev \\',
        '  openssl-dev'
      ]);
    }
  }
};
