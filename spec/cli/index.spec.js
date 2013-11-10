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
        expect(doclet.compile).toHaveBeenCalled();
    });
});
