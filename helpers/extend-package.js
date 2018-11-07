const { merge } = require('lodash');

module.exports = (generator, json, overwrite = false) => {
  const packageJson = generator.destinationPath('package.json');
  const oldPkg = generator.fs.readJSON(packageJson, {});

  const newPkg = overwrite ? merge(json, oldPkg) : merge(oldPkg, json);

  generator.fs.writeJSON(packageJson, newPkg);
};
