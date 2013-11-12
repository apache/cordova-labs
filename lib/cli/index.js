/*!
 * Module dependencies.
 */

var optimist = require('optimist'),
    doclet = require('../doclet');

/**
 * CLI execution.
 *
 * Execute a command from the command-line.
 *
 * @param {String} argv is the value of process.argv.
 */

module.exports.exec = function(argv) {
    // parse the arguments and compile with optional path
    argv = optimist.parse(argv);
    doclet.compile(argv._[2]);
};
