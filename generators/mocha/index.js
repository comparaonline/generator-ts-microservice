'use strict';
const _ = require('lodash');
const extend = _.merge;
const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  static get devDependencies() {
    return ['mocha', 'chai', '@types/mocha', '@types/chai'];
  }
  writing() {
    const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    const pkg = extend({
      scripts: {
        test: 'TS_NODE_FILES=true NODE_CONFIG_ENV=test mocha',
        'test:fast': 'TS_NODE_FILES=true NODE_CONFIG_ENV=test mocha',
        pretest: this._preTest()
      }
    }, currentPkg);

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

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
      )
    }
    return additionalParts.join('\n')
  }
};
