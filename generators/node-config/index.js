'use strict';
const mkdirp = require('mkdirp');
const ejs = require('ejs');
const _ = require('lodash');
const extend = _.merge;
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  static get dependencies() {
    return ['config'];
  }

  static get devDependencies() {
    return ['@types/config'];
  }

  constructor(args, options) {
    super(args, options);
    this.option('name', {
      type: String,
      required: true,
      desc: 'Project name'
    });
  }

  writing() {
    mkdirp.sync('config');
    const envs = ['default', 'test', 'development', 'staging', 'production'];
    envs.forEach(env => this._extendConfig(env));
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('config/.gitignore')
    )
  }

  _extendConfig(file) {
    const config = extend(
      this._loadTemplate(file),
      this._loadOriginal(file)
    );
    this.fs.writeJSON(this.destinationPath(`config/${file}.json`), config);
  }

  _loadOriginal(file) {
    try {
      this.fs.readJSON(this.destinationPath(`config/${file}.json`), {})
    } catch (e) {
      return {};
    }
  }

  _loadTemplate(file) {
    const text = this.fs.read(this.templatePath(`${file}.json`), '{}');
    const rendered = ejs.render(text, { microserviceName: this.options.name });
    return JSON.parse(rendered.trim() || '{}');
  }
};
