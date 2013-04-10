'use strict';

var expect = require('chai').expect;
var validator = require('../../lib/src/registry/portal-registry-validator');

function rec(over) {
  var base = {
    id: 'x-y', name: 'X', city: 'C', lat: 0, lon: 0, rss: 'http://x'
  };
  var k;
  for (k in over) { if (over.hasOwnProperty(k)) { base[k] = over[k]; } }
  return base;
}

describe('portalRegistryValidator.validate', function () {
  it('accepts a well-formed document', function () {
    var errs = validator.validate({ AR: [rec()] });
    expect(errs).to.have.length(0);
  });

  it('flags missing required fields', function () {
    var partial = rec();
    delete partial.rss;
    var errs = validator.validate({ AR: [partial] });
    expect(errs.join(' ')).to.match(/missing rss/);
  });

  it('flags coordinates out of range', function () {
    var bad = rec({ lat: 200 });
    var errs = validator.validate({ AR: [bad] });
    expect(errs.join(' ')).to.match(/lat out of range/);
  });

  it('flags duplicate ids across countries', function () {
    var errs = validator.validate({
      AR: [rec({ id: 'same' })],
      BR: [rec({ id: 'same' })]
    });
    expect(errs.join(' ')).to.match(/duplicate id same/);
  });

  it('flags more than three portals per country', function () {
    var errs = validator.validate({
      AR: [rec({ id: 'a' }), rec({ id: 'b' }), rec({ id: 'c' }), rec({ id: 'd' })]
    });
    expect(errs.join(' ')).to.match(/more than three portals/);
  });
});
