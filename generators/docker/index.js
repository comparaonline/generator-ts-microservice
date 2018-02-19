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
      base: [],
      files: [],
      folders: []
    };
    this._addSequelize(options);
    this._addEventStreamer(options);
    return options;
  }

  _addSequelize(options) {
    if (this.options.hasDependency('sequelize')) {
      options.folders = (options.folders || []).concat(['migrations']);
      options.files = (options.files || []).concat(['.sequelizerc']);
    }
  }

  _addEventStreamer(options) {
    if (this.options.hasDependency('event-streamer')) {
      options.base = (options.base || []).concat([
        'ENV BUILD_LIBRDKAFKA=0',
        'RUN apk add --no-cache \\',
        '  libressl --repository http://dl-cdn.alpinelinux.org/alpine/v3.7/main \\',
        '  librdkafka-dev --repository http://dl-cdn.alpinelinux.org/alpine/v3.7/community'
      ]);
    }
  }
};
