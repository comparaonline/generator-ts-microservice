const { safeLoad, safeDump } = require('js-yaml');
const _ = require('lodash');
const extend = _.merge;
const Generator = require('yeoman-generator');

module.exports = class YamlGenerator extends Generator {
  readYaml(path, defaultValue) {
    try {
      const text = this.fs.read(path);
      return safeLoad(text);
    } catch (e) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw e;
    }
  }

  writeYaml(path, yaml) {
    const options = {}
    if (this._yamlOrder) {
      options.sortKeys = this._yamlOrder;
    }
    const text = safeDump(yaml, options);
    this.fs.write(path, text);
  }

  extendYaml(originalPath, newPath, additionalYaml = {}) {
    const originalYaml = this.readYaml(originalPath, {});
    const newYaml = typeof newPath === 'string' ?
      this.readYaml(newPath, {}) : newPath;
    const extendedYaml = extend(newYaml, additionalYaml, originalYaml);
    this.writeYaml(originalPath, extendedYaml);
  }
};
