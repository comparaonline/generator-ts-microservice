const { safeLoad, safeDump } = require('js-yaml');
const _ = require('lodash');
const extend = _.merge;

module.exports = (object) => {
  object.readLines = function (filePath) {
    try {
      this.fs.read(filePath, '').split('\n');
    } catch (e) {
      return [];
    }
  }

  object.saveLines = function (filePath, lines) {
    const text = lines
      .filter(line => line.trim() !== '')
      .concat([''])
      .join('\n');
    this.fs.write(filePath, text);
  }

  object.extendLines = function (originalPath, newPath, additionalLines = []) {
    const original = this.readLines(originalPath);
    const newFile = typeof newPath === 'string' ?
      this.readLines(newPath, '') : newPath;
    const extended = newFile.concat(additionalLines).concat(original);
    const unique = Array.from(new Set(extended)).sort()
    this.saveLines(originalPath, unique);
  };
};
