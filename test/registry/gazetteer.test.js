'use strict';

var expect = require('chai').expect;
var gazetteer = require('../../lib/src/registry/gazetteer');

describe('gazetteer.find', function () {
  it('returns the entry for an exact name match', function () {
    var hit = gazetteer.find('Buenos Aires');
    expect(hit).to.not.equal(null);
    expect(hit.country).to.equal('AR');
  });

  it('is case-insensitive and accent-folded', function () {
    expect(gazetteer.find('sao paulo').country).to.equal('BR');
    expect(gazetteer.find('SAO PAULO').country).to.equal('BR');
  });

  it('returns null for unknown names', function () {
    expect(gazetteer.find('Atlantis')).to.equal(null);
  });
});

describe('gazetteer.all', function () {
  it('returns a defensive copy', function () {
    var first = gazetteer.all();
    first.length = 0;
    expect(gazetteer.all().length).to.be.above(0);
  });
});
