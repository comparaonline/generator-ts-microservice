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

    const dockerOptions = { microserviceName: this.options.name };
    this._addSequelize(dockerOptions);
    this._addEventStreamer(dockerOptions);

    this.fs.copyTpl(
      this.templatePath('Dockerfile'),
      this.destinationPath('Dockerfile'),
      dockerOptions
    );
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
