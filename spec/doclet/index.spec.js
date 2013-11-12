/*!
 * Module dependencies.
 */

var dir = require('node-dir'),
    doclet = require('../../lib/doclet'),
    options;

/*!
 * Doclet specification.
 */

describe('doclet.compile(path)', function() {
  beforeEach(function() {
    options = '/some/path';
    spyOn(dir, 'paths');
  });

  it('should not require path argument', function() {
    expect(doclet.compile).not.toThrow();
  });

  it('should default path to cwd', function() {
    doclet.compile();
    expect(dir.paths).toHaveBeenCalledWith(
      process.cwd(),
      jasmine.any(Function)
    );
  });
});
