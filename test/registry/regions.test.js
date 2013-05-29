'use strict';

var expect = require('chai').expect;
var regions = require('../../lib/src/registry/regions');
var bbox = require('../../lib/src/domain/bounding-box');

describe('regions registry', function () {
  it('exposes Americas, North America and South America presets', function () {
    expect(regions.AMERICAS.id).to.equal('americas');
    expect(regions.NORTH_AMERICA.id).to.equal('north-america');
    expect(regions.SOUTH_AMERICA.id).to.equal('south-america');
  });

  it('contains Buenos Aires inside the South America bbox', function () {
    expect(bbox.contains(regions.SOUTH_AMERICA.bbox, -34.6, -58.4)).to.equal(true);
  });

  it('contains New York inside the North America bbox', function () {
    expect(bbox.contains(regions.NORTH_AMERICA.bbox, 40.7, -74.0)).to.equal(true);
  });

  it('looks up regions by id', function () {
    expect(regions.byId('north-america').name).to.equal('North America');
    expect(regions.byId('unknown')).to.equal(null);
  });
});
