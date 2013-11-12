/*!
 * Module dependencies.
 */

var cli = require('../../lib/cli'),
    doclet = require('../../lib/doclet'),
    argv;

/*!
 * CLI specification.
 */

describe('cli.exec(argv)', function() {
    beforeEach(function() {
        argv = ['node', '/usr/local/bin/doclet'];
        spyOn(doclet, 'compile');
    });

    it('should call doclet.compile', function() {
        cli.exec(argv);
        expect(doclet.compile).toHaveBeenCalledWith(undefined);
    });

    it('should support a path argument', function() {
        argv.push('/some/path');
        cli.exec(argv);
        expect(doclet.compile).toHaveBeenCalledWith('/some/path');
    });
});
