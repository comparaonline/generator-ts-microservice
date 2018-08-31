'use strict';
const mkdirp = require('mkdirp');
const _ = require('lodash');
const extend = _.merge;
const yamlHelper = require('../../helpers/yaml-helper');
const fileHelper = require('../../helpers/file-helper');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  static get dependencies() {
    return ['sequelize', 'sequelize-cli', 'sequelize-typescript@^0.6.6-beta.1', 'pg'];
  }
  constructor(args, options) {
    super(args, options);
    fileHelper(this);
    this.originalConfig = this.fs.readJSON(
      this.destinationPath('config/default.json'),
      { raven: { dsn: false } }
    );
  }

  prompting() {
    const prompts = [
      {
        name: 'dsn',
        message: 'Sentry.io DSN',
        default: this.originalConfig.raven.dsn
      }
    ];
    return this.prompt(prompts).then(props => {
      this.props = extend(this.props, props);
    });
  }

  writing() {
    this.extendLines(
      this.destinationPath('src/initialization/index.ts'),
      ["import './raven';"]
    );
    this._extendConfig();

    mkdirp.sync(this.destinationPath('src/initialization'));

    this.fs.copy(
      this.templatePath('raven.ts'),
      this.destinationPath('src/initialization/raven.ts')
    );
  }

  _extendConfig() {
    const defaultConfig = extend(
      {
        raven: {
          dsn: this.props.dsn
        }
      },
      this.fs.readJSON(this.destinationPath('config/default.json'), {})
    );
    this.fs.writeJSON(this.destinationPath('config/default.json'), defaultConfig);
  }
};
