'use strict';
const Generator = require('yeoman-generator');
const yamlHelper = require('../../helpers/yaml-helper');
const mkdirp = require('mkdirp');

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
      .reduce((a, b) => [...a, ...b])
      .filter(dep => dep.registerServer !== undefined)
      .map(dep => dep.registerServer)
      .map(server => `import '${server}';`)
      .sort()
      .join('\n');

    mkdirp.sync(this.destinationPath('bin'));

    this.fs.copyTpl(
      this.templatePath('index.ts'),
      this.destinationPath('src/index.ts'),
      { servers }
    );

    this.fs.copy(
      this.templatePath('initialization'),
      this.destinationPath('src/initialization')
    )
  }
};
