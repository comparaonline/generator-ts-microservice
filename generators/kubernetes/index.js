'use strict';
const ejs = require('ejs');
const mkdirp = require('mkdirp');
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
    mkdirp.sync(this.destinationPath('k8s'));

    this.fs.copyTpl(
      this.templatePath('deployment.yml'),
      this.destinationPath(`k8s/${this.options.name}-deployment.yml`),
      {
        microserviceName: this.options.name
      }
    );

    this.fs.copyTpl(
      this.templatePath('service.yml'),
      this.destinationPath(`k8s/${this.options.name}-service.yml`),
      {
        microserviceName: this.options.name
      }
    );
  }

  _yamlOrder(a, b) {
    const max = 10000;
    const order = {
      apiVersion: 1,
      kind: 2,
      metadata: 3,
      command: max,
      spec: max
    };
    const valueOf = name => order[name] || max - 1;
    return valueOf(a) - valueOf(b) || a.localeCompare(b);
  }

  _loadYamlTemplate(file) {
    const text = this.fs.read(this.templatePath(file));
    const rendered = ejs.render(text, { microserviceName: this.options.name });
    return this.parseYaml(rendered.trim());
  }
};
