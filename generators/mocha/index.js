'use strict';
const Generator = require('yeoman-generator');
const addScript = require('../../helpers/add-script');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  static get devDependencies() {
    return ['mocha', 'chai', '@types/mocha', '@types/chai'];
  }
  writing() {
    const envs = 'TS_NODE_FILES=true NODE_CONFIG_ENV=test';
    const test = `${envs} mocha 'src/**/__tests__/**/*.test.{ts,tsx}'`;
    addScript(this, 'test', test);
    addScript(this, 'test:fast', test);
    addScript(this, 'pretest', this._preTest())

    mkdirp.sync(this.destinationPath('test'));
    this.fs.copyTpl(
      this.templatePath('mocha.opts.ejs'),
      this.destinationPath('test/mocha.opts'),
      { additional: this._additional() }
    )

    this._testInitialization();
  }

  _orms() {
    return ['sequelize', 'typeorm']
      .filter(orm => this.options.hasDependency(orm));
  }

  _additional() {
    return ['sequelize', 'typeorm']
      .filter(orm => this.options.hasDependency(orm))
      .map(orm => `--file ./src/test-helpers/${orm}.ts`)
      .join(',\n    ');
  }

  _preTest() {
    return Object.entries({
      tslint: 'yarn tslint',
      sequelize: 'NODE_CONFIG_ENV=test yarn migrate',
      typeorm: 'NODE_CONFIG_ENV=test yarn migrate'
    })
      .filter(([k]) => this.options.hasDependency(k))
      .map(([_, v]) => v)
      .join(' && ');
  }

  _testInitialization() {
    const orms = this._orms();
    if (orms.length === 0) return;
    mkdirp.sync(this.destinationPath('src/test-helpers'));
    orms
      .map(orm => [`${orm}.ts`, `src/test-helpers/${orm}.ts`])
      .forEach(([from, to]) => this.fs.copy(
        this.templatePath(from),
        this.destinationPath(to)
      ));
  }
};
