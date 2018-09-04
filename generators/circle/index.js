'use strict';
const ejs = require('ejs');
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
    yamlHelper(this);
  }

  writing() {
    this.extendYaml(
      this.destinationPath('.circleci/config.yml'),
      this._loadYamlTemplate('config.yml')
    );
  }

  _yamlOrder(a, b) {
    const max = 10000;
    const order = {
      version: 1,
      services: 2,
      jobs: 2,
      steps: max
    };
    const valueOf = name => order[name] || max - 1;
    return valueOf(a) - valueOf(b) || a.localeCompare(b);
  }

  _loadYamlTemplate(file) {
    const text = this.fs.read(this.templatePath(file), '');
    const rendered = ejs.render(text, { microserviceName: this.options.name });
    return this.parseYaml(rendered.trim());
  }
};
