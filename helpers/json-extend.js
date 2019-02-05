const { merge,  }  = require('lodash');

/**
 *  Extends a JSON file using a template and possibly additional JSON
 *
 * @param {Generator} generator
 * @returns {function(string, string, {}): {}}}
 */
module.exports = generator => (outputPath, templatePath, additional = {}) => {
  const output = JSON.parse(generator.fs.read(generator.destinationPath(outputPath), '{}'));
  const template = JSON.parse(generator.fs.read(generator.templatePath(templatePath)));
  const result = merge(output, template, additional);
  generator.fs.writeJSON(generator.destinationPath(outputPath), result);
  return result;
}
