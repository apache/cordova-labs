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

  describe('path parameter', function() {
    it('should not be required', function() {
      expect(doclet.compile).not.toThrow();
    });

    it('should default cwd', function() {
      doclet.compile();
      expect(dir.paths).toHaveBeenCalledWith(
        process.cwd(),
        jasmine.any(Function)
      );
    });

    it('should be supported', function() {
      doclet.compile(options);
      expect(dir.paths).toHaveBeenCalledWith(
        options,
        jasmine.any(Function)
      );
    });
  });
});
