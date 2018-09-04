const { wrap } = require('./fn-helper');
const unique = array => Array.from(new Set(array));

module.exports = (object) => {
  const read = wrap(path => object.fs.read(path, '').split('\n')).onError([]);
  const format = lines => unique(lines)
    .filter(line => typeof line === 'string')
    .filter(line => line.trim() !== '')
    .sort()
    .concat([''])
    .join('\n');
  const save = (path, lines) => object.fs.write(path, format(lines));

  object.extendLines = (originalPath, additionalLines) => save(
    originalPath,
    read(originalPath).concat(additionalLines)
  );
};
