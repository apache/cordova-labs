/*!
 * Module dependencies.
 */

var async = require('async'),
    dir = require('node-dir'),
    fs = require('fs'),
    marked = require('marked'),
    path = require('path');

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

  // configure markdown parser
  marked.setOptions({
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true
  });

  // find all files
  dir.paths(path, function(e, paths) {
    // iterate each file
    async.each(paths.files, function(filepath, callback) {
      // render markdown
      if (isMarkdown(filepath)) {
        console.log(module.exports.markdown(filepath));
      }
      else {
        console.log('cp asset'); 
      }
    });
  });
};

module.exports.markdown = function(filepath) {
  return marked(fs.readFileSync(filepath, 'utf8'));
};

function isMarkdown(filepath) {
  return (['.md'].indexOf(path.extname(filepath)) >= 0);
}
