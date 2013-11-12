/*!
 * Module dependencies.
 */

var shell = require('shelljs'),
    path = require('path'),
    bin,
    options;

/*!
 * Shell script specification.
 */

describe('$ doclet [options] <path>', function() {
  beforeEach(function() {
    bin = 'node ' + path.resolve(path.join(__dirname, '..', '..', 'bin', 'index.js'));
    options = { silent: true };
    spyOn(process.stdout, 'write');
  });

  it('should have exit code 0', function() {
    var process = shell.exec(bin, options);
    expect(process.code).toEqual(0);
  });
});
