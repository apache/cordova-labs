/*!
 * Module dependencies.
 */

var optimist = require('optimist');

/**
 * CLI execution.
 *
 * Execute a command from the command-line.
 *
 * @param {String} argv is the value of process.argv.
 */

module.exports.exec = function(argv) {
    argv = optimist.parse(argv);

    //var paths = argv._.splice(2);
    //argv._ = undefined;
    //argv.$0 = undefined;
};
