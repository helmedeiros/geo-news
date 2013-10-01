'use strict';

var expect = require('chai').expect;
var port = require('../../lib/src/ports/location-extractor-port');

describe('LocationExtractorPort.isImplementation', function () {
  it('accepts an object exposing an extract function', function () {
    expect(port.isImplementation({ extract: function () {} })).to.equal(true);
  });

  it('rejects non-conforming objects', function () {
    expect(port.isImplementation(null)).to.equal(false);
    expect(port.isImplementation({})).to.equal(false);
  });
});
