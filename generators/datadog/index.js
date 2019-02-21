'use strict';
const mkdirp = require('mkdirp');
const merge = require('lodash/merge');
const fileHelper = require('../../helpers/file-helper');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  static get dependencies() {
    return ['dd-trace'];
  }

  static get devDependencies() {
    return ['@types/dd-trace'];
  }

  constructor(args, options) {
    super(args, options);
    fileHelper(this);

    this.defaultProjectName = options.name;
    this.originalConfig = this.fs.readJSON(
      this.destinationPath('config/default.json'),
      { datadog: { projectName: this.defaultProjectName } }
    );
  }

  prompting() {
    const prompts = [
      {
        name: 'projectName',
        message: 'Datadog Project Name (only use default if this app is cross business unit)',
        type: 'list',
        default: this.defaultProjectName,
        choices: [
          {
            name: 'Travel Assistance',
            value: 'travel-assistance'
          },
          {
            name: 'Car Insurance CL',
            value: 'car-insurance-cl'
          },
          {
            name: 'Car Insurance BR',
            value: 'car-insurance-br'
          },
          {
            name: 'Car Insurance CO',
            value: 'car-insurance-co'
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
  }

  _extendConfig() {
    const defaultConfig = merge(
      {
        datadog: {
          projectName: this.props.projectName
        }
      },
      this.fs.readJSON(this.destinationPath('config/default.json'), {})
    );
    this.fs.writeJSON(this.destinationPath('config/default.json'), defaultConfig);
  }
};
