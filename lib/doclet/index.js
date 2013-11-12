/*!
 * Module dependencies.
 */

var dir = require('node-dir');

/**
 * Doclet compiler.
 *
 * Compiles the documentation.
 *
 * @param {String} path is the documentation path.
 */

module.exports.compile = function(path) {
  // default to current working directory
  path = path || process.cwd();

  // each file
  dir.paths(path, function(e, paths) {
    // parse markdown
    // render html
  });
};
