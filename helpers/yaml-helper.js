const { safeLoad, safeDump } = require('js-yaml');
const _ = require('lodash');
const extend = _.merge;

module.exports = (object) => {
  object.readYaml = function (path, defaultValue) {
    try {
      const text = this.fs.read(path);
      return this.parseYaml(text);
    } catch (e) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw e;
    }
  };

  object.parseYaml = (text, defaultValue) => {
    try {
      return safeLoad(text);
    } catch (e) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw e;
    }
  };

  object.writeYaml = function (path, yaml) {
    const options = {}
    if (this._yamlOrder) {
      options.sortKeys = this._yamlOrder;
    }
    const text = safeDump(yaml, options);
    this.fs.write(path, text);
  };

  object.extendYaml = function (originalPath, newPath, additionalYaml = {}) {
    const originalYaml = typeof originalPath == 'string' ?
      this.readYaml(originalPath, {}) : originalPath;
    const newYaml = typeof newPath === 'string' ?
      this.readYaml(newPath, {}) : newPath;
    const extendedYaml = extend(newYaml, additionalYaml, originalYaml);
    this.writeYaml(originalPath, extendedYaml);
  };
};
