'use strict';
const mkdirp = require('mkdirp');
const merge = require('lodash/merge');
const fileHelper = require('../../helpers/file-helper');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  static get dependencies() {
    return [
      'dd-trace',
      'opentracing',
      'winston',
      'express-winston'
    ];
  }

  static get devDependencies() {
    return ['@types/express-winston', '@types/express-winston'];
  }

  constructor(args, options) {
    super(args, options);
    fileHelper(this);

    this.defaultProjectName = options.name;
    this.originalConfig = this.fs.readJSON(
      this.destinationPath('config/default.json'),
      {
        datadog: {
          host: 'datadog',
          projectName: this.defaultProjectName
        },
        winston: {
          format: 'simple'
        }
      }
    );
  }

  prompting() {
    const prompts = [
      {
        name: 'projectName',
        message: 'Datadog Project Name (only use default if this app is cross business unit)',
        type: 'list',
        default: this.originalConfig.datadog.projectName,
        choices: [
          {
            name: 'Travel Assistance',
            value: 'travel-assistance'
          },
          {
            name: 'Car Insurance',
            value: 'car-insurance'
          },
          {
            name: 'Leadgeneration',
            value: 'leadgen'
          },
          {
            name: `${this.defaultProjectName} (default app name)`,
            value: this.defaultProjectName
          }
        ]
      }
    ];
    return this.prompt(prompts).then(props => {
      this.props = merge(this.props, props);
    });
  }

  writing() {
    this.extendLines(
      this.destinationPath('src/initialization/index.ts'),
      ["import './datadog';"]
    );
    this._extendConfig();

    mkdirp.sync(this.destinationPath('src/initialization'));

    this.fs.copy(
      this.templatePath('datadog.ts'),
      this.destinationPath('src/initialization/datadog.ts')
    );

    this.fs.copy(
      this.templatePath('winston.ts'),
      this.destinationPath('src/initialization/winston.ts')
    )
  }

  _extendConfig() {
    const defaultConfig = merge(
      this.fs.readJSON(this.destinationPath('config/default.json'), {}),
      {
        datadog: {
          projectName: this.props.projectName,
          host: 'datadog'
        },
        winston: {
          format: 'simple'
        }
      }
    );
    this.fs.writeJSON(this.destinationPath('config/default.json'), defaultConfig);

    const productionConfig = merge(
      this.fs.readJSON(this.destinationPath('config/production.json'), {}),
      {
        winston: {
          format: 'default'
        }
      }
    );
    this.fs.writeJSON(this.destinationPath('config/production.json'), productionConfig);
  }
};
