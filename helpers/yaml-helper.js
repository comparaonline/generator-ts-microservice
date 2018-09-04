const { safeLoad, safeDump } = require('js-yaml');
const _ = require('lodash');
const extend = _.merge;
const { wrap } = require('./fn-helper');
const isString = value => typeof value === 'string';

module.exports = (object) => {
  const read = wrap(path => object.fs.read(path, '')).onError('');
  const format = yaml => safeDump(yaml, {
    ...(object._yamlOrder && { sortKeys: object._yamlOrder })
  });
  const writeYaml = (path, yaml) => object.fs.write(path, format(yaml));

  object.parseYaml = wrap(text => safeLoad(text)).onError({}).onUndefined({});
  object.readYaml = path => object.parseYaml(read(path));

  const readIfNecessary = wrap(object.readYaml).if(isString);

  object.extendYaml = (original, extended, yaml = {}) => writeYaml(
    original,
    extend(readIfNecessary(original, {}), readIfNecessary(extended, {}), yaml)
  );
};
