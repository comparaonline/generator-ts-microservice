'use strict';
const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');
const { merge } = require('lodash');
const yamlHelper = require('../../helpers/yaml-helper');
const fileHelper = require('../../helpers/file-helper');
const addScript = require('../../helpers/add-script');

module.exports = class extends Generator {
  static get dependencies() {
    return ['sequelize', 'sequelize-cli', 'sequelize-typescript@^0.6.6-beta.1', 'pg'];
  }
  constructor(args, options) {
    super(args, options);
    this.option('name', {
      type: String,
      required: true,
      desc: 'Project name'
    });
    yamlHelper(this);
    fileHelper(this);
  }

  writing() {
    this._extendPackage();
    this.extendYaml(
      this.destinationPath('docker-compose.yml'),
      this.templatePath('docker-compose.yml'),
      {
        services: {
          postgres: {
            environment: {
              POSTGRES_DB: this.options.name
            }
          }
        }
      }
    );
    this._extendConfig();

    mkdirp.sync(this.destinationPath('src/initialization'));
    mkdirp.sync(this.destinationPath('migrations'));
    mkdirp.sync(this.destinationPath('src/seeders'));
    mkdirp.sync(this.destinationPath('src/models'));

    this.fs.copy(
      this.templatePath('bin'),
      this.destinationPath('bin')
    );

    this.fs.copy(
      this.templatePath('sequelize.ts'),
      this.destinationPath('src/initialization/sequelize.ts')
    );

    this.fs.copy(
      this.templatePath('sequelizerc'),
      this.destinationPath('.sequelizerc')
    );

    this.fs.copy(
      this.templatePath('gitkeep'),
      this.destinationPath('migrations/.gitkeep')
    );

    this.fs.copy(
      this.templatePath('gitkeep'),
      this.destinationPath('src/seeders/.gitkeep')
    );

    this.extendLines(
      this.destinationPath('src/initialization/index.ts'),
      ["import './sequelize';"]
    );
  }

  _yamlOrder(a, b) {
    const max = 10000;
    const order = {
      version: 1,
      services: 2,
      build: 3,
      image: 3,
      volumes: max
    };
    const valueOf = name => order[name] || max - 1;
    return valueOf(a) - valueOf(b) || a.localeCompare(b);
  }

  _extendPackage() {
    const pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    const prestart = ((pkg || {}).scripts || {}).prestart;
    const migrate = 'yarn migrate';

    addScript(this, 'migrate', 'sequelize db:migrate');
    addScript(this, 'premigrate', 'bin/createdb');
    addScript(this, 'sequelize', 'sequelize');
    addScript(this, 'prestart', migrate);
    addScript(this, 'prestart:dev', migrate);
  }

  _extendConfig() {
    const defaultConfig = merge(
      {
        sequelize: {
          username: "user",
          password: "pass",
          database: this.options.name,
          host: "localhost",
          dialect: "postgresql"
        }
      },
      this.fs.readJSON(this.destinationPath('config/default.json'), {})
    );
    const testConfig = merge(
      {
        sequelize: {
          database: `${this.options.name}-test`,
          logging: false
        }
      },
      this.fs.readJSON(this.destinationPath('config/test.json'), {})
    );
    this.fs.writeJSON(this.destinationPath('config/default.json'), defaultConfig);
    this.fs.writeJSON(this.destinationPath('config/test.json'), testConfig);
  }
};
