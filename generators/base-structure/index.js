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
    this.option('dependencies', {
      type: Array,
      required: false,
      desc: 'All other selected dependencies'
    });
    yamlHelper(this);
  }

  writing() {
    const servers = this.options.dependencies
      .reduce((a, b) => a.concat(b), [])
      .map(require)
      .filter(dep => dep.registerServer !== undefined)
      .map(dep => dep.registerServer)
      .map(dep => `require('${dep}').default`);

    this.fs.copyTpl(
      this.templatePath('index.ts'),
      this.destinationPath('src/index.ts'),
      {
        servers: servers.join(',\n  ')
      }
    );

    this.fs.copy(
      this.templatePath('initialization'),
      this.destinationPath('src/initialization')
    )
  }
};
