'use strict';

var expect = require('chai').expect;
var geo = require('../../lib/src/domain/geo');

describe('geo.haversineKm', function () {
  it('returns 0 for the same point', function () {
    expect(geo.haversineKm(0, 0, 0, 0)).to.equal(0);
  });

  it('approximates the Buenos Aires to São Paulo distance (~1700km)', function () {
    var d = geo.haversineKm(-34.6, -58.4, -23.55, -46.63);
    expect(d).to.be.above(1600);
    expect(d).to.be.below(1800);
  });
});
