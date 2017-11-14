'use strict';
const mkdirp = require('mkdirp');
const _ = require('lodash');
const extend = _.merge;
const yamlHelper = require('../../helpers/yaml-helper');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);
    this.option('name', {
      type: String,
      required: true,
      desc: 'Project name'
    });
    yamlHelper(this);
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

    this.fs.copy(
      this.templatePath('sequelizerc'),
      this.destinationPath('.sequelizerc')
    );
    mkdirp.sync('migrations');
    mkdirp.sync('src/seeders');

    this.fs.copy(
      this.templatePath('models'),
      this.destinationPath('src/models')
    );

    this.fs.copy(
      this.templatePath('gitkeep'),
      this.destinationPath('migrations/.gitkeep')
    );

    this.fs.copy(
      this.templatePath('gitkeep'),
      this.destinationPath('src/seeders/.gitkeep')
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
    const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    const prestart = currentPkg.scripts.prestart;
    const prewatch = currentPkg.scripts.prewatch;
    const migrate = 'yarn sequelize db:migrate';

    const pkg = extend({
      scripts: {
        sequelize: 'sequelize',
        prestart: prestart ? `${prestart} && ${migrate}` : migrate,
        prewatch: prewatch ? `${prewatch} && ${migrate}` : migrate
      }
    }, currentPkg);
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }

  _extendConfig() {
    const config = extend(
      {
        sequelize: {
          username: "user",
          password: "pass",
          database: this.options.name,
          host: "postgres",
          dialect: "postgresql"
        }
      },
      this.fs.readJSON(this.destinationPath('config/default.json'), {})
    );
    this.fs.writeJSON(this.destinationPath('config/default.json'), config);
  }

  install() {
    this.yarnInstall(['sequelize', 'sequelize-cli', 'sequelize-typescript', 'pg']);
  }
};
