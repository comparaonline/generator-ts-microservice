const extendPackage = require('./extend-package');

module.exports = (generator, name, script) => {
  const json = {
    scripts: {
      [name]: script
    }
  };
  extendPackage(generator, json, true);
};
