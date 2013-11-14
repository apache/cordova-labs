/*!
 * Module dependencies.
 */

var dir = require('node-dir'),
    doclet = require('../../lib/doclet'),
    fs = require('fs'),
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

  describe('markdown parser', function() {
    beforeEach(function() {
      dir.paths.andCallFake(function(path, callback) {
        callback(null, { files: [
          '/some/path/file-1.md',
          '/some/path/file-2.md',
          '/some/path/file-3.md'
        ]});
      });
      spyOn(fs, 'readFileSync').andReturn('# Markdown');
      spyOn(doclet, 'markdown');
    });

    it('should be called for each file', function() {
      doclet.compile(options);
      expect(doclet.markdown.calls.length).toEqual(3);
    });
  });
});
