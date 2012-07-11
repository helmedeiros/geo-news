'use strict';

var expect = require('chai').expect;
var portal = require('../../lib/src/domain/portal');

var sample = {
  id: 'ar-clarin',
  name: 'Clarin',
  country: 'AR',
  city: 'Buenos Aires',
  lat: -34.61,
  lon: -58.38,
  rss: 'http://example.com/clarin/rss'
};

describe('Portal.create', function () {
  it('returns a frozen value carrying the given attributes', function () {
    var p = portal.create(sample);
    expect(p.id).to.equal('ar-clarin');
    expect(p.country).to.equal('AR');
    expect(p.city).to.equal('Buenos Aires');
    expect(Object.isFrozen(p)).to.equal(true);
  });
});

describe('Portal.equals', function () {
  it('compares by id alone', function () {
    var a = portal.create(sample);
    var b = portal.create({
      id: 'ar-clarin', name: 'Other', country: 'AR',
      city: 'Cordoba', lat: 0, lon: 0, rss: ''
    });
    expect(portal.equals(a, b)).to.equal(true);
  });
});
