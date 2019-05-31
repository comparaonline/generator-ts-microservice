'use strict';
const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');
const { merge } = require('lodash');
const yamlHelper = require('../../helpers/yaml-helper');
const fileHelper = require('../../helpers/file-helper');
const addScript = require('../../helpers/add-script');

module.exports = class extends Generator {
  static get dependencies() {
    return ['typeorm', 'reflect-metadata', 'pg'];
  }
  static get devDependencies() {
    return ['@types/node'];
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
    mkdirp.sync(this.destinationPath('src/migrations'));
    mkdirp.sync(this.destinationPath('src/entities'));

    this.fs.copy(
      this.templatePath('bin'),
      this.destinationPath('bin')
    );

    this.fs.copy(
      this.templatePath('typeorm.ts'),
      this.destinationPath('src/initialization/typeorm.ts')
    );

    this.fs.copy(
      this.templatePath('ormconfig.js'),
      this.destinationPath('ormconfig.js')
    );

    this.fs.copy(
      this.templatePath('ormconfig.prod.js'),
      this.destinationPath('ormconfig.prod.js')
    );

    this.fs.copy(
      this.templatePath('gitkeep'),
      this.destinationPath('src/migrations/.gitkeep')
    );

    this.fs.copy(
      this.templatePath('gitkeep'),
      this.destinationPath('src/entities/.gitkeep')
    );

    this.extendLines(
      this.destinationPath('src/initialization/index.ts'),
      ["import './typeorm';"]
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

    addScript(this, 'migrate', 'typeorm migration:run');
    addScript(this, 'premigrate', 'bin/createdb');
    addScript(this, 'typeorm', 'node -r ts-node/register ./node_modules/.bin/typeorm');
    addScript(this, 'prestart', migrate);
    addScript(this, 'prestart:dev', migrate);
  }

  _extendConfig() {
    const defaultConfig = merge(
      {
        orm: {
          username: "user",
          password: "pass",
          database: this.options.name,
          host: "localhost",
          dialect: "postgresql",
          type: "postgres",
          port: 5432
        }
      },
      this.fs.readJSON(this.destinationPath('config/default.json'), {})
    );
    const testConfig = merge(
      {
        orm: {
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
