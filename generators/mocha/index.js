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
      this.templatePath('mocha.opts'),
      this.destinationPath('test/mocha.opts'),
      { additional: this._additional() }
    )

    this._testInitialization();
  }

  _additional() {
    const additional = [];
    if (this.options.hasDependency('sequelize')) {
      additional.push('--file ./src/test-helpers/sequelize.ts');
    } else if (this.options.hasDependency('typeorm')) {
      additional.push('--file ./src/test-helpers/typeorm.ts');
    }
    return additional.toString('\n');
  }

  _preTest() {
    const pretest = [];
    if (this.options.hasDependency('tslint')) {
      pretest.push('yarn tslint');
    }
    if (this.options.hasDependency('sequelize')) {
      pretest.push('NODE_CONFIG_ENV=test yarn migrate');
    } else if (this.options.hasDependency('typeorm')) {
      pretest.push('NODE_CONFIG_ENV=test yarn migrate');
    }
    return pretest.join(' && ');
  }

  _testInitialization() {
    const additionalParts = [];
    if (this.options.hasDependency('sequelize')) {
      mkdirp.sync(this.destinationPath('src/test-helpers'));
      this.fs.copy(
        this.templatePath('sequelize.ts'),
        this.destinationPath('src/test-helpers/sequelize.ts')
      );
    } else if (this.options.hasDependency('typeorm')) {
      mkdirp.sync(this.destinationPath('src/test-helpers'));
      this.fs.copy(
        this.templatePath('typeorm.ts'),
        this.destinationPath('src/test-helpers/typeorm.ts')
      );
    }
    return additionalParts.join('\n')
  }
};
