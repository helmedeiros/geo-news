'use strict';

var expect = require('chai').expect;
var bbox = require('../../lib/src/domain/bounding-box');

describe('BoundingBox.create', function () {
  it('returns a frozen box with the four edges', function () {
    var b = bbox.create(-60, -90, 15, -30);
    expect(b.south).to.equal(-60);
    expect(b.west).to.equal(-90);
    expect(b.north).to.equal(15);
    expect(b.east).to.equal(-30);
    expect(Object.isFrozen(b)).to.equal(true);
  });

  it('rejects boxes where south > north', function () {
    expect(function () { bbox.create(10, 0, -10, 20); }).to['throw'](RangeError);
  });

  it('rejects boxes where west > east', function () {
    expect(function () { bbox.create(0, 30, 10, -30); }).to['throw'](RangeError);
  });
});

describe('BoundingBox.contains', function () {
  var southAmerica = bbox.create(-60, -90, 15, -30);

  it('returns true for a point inside the box', function () {
    expect(bbox.contains(southAmerica, -34.61, -58.38)).to.equal(true);
  });

  it('returns true for a point on the edge of the box', function () {
    expect(bbox.contains(southAmerica, -60, -90)).to.equal(true);
    expect(bbox.contains(southAmerica, 15, -30)).to.equal(true);
  });

  it('returns false for a point outside the box', function () {
    expect(bbox.contains(southAmerica, 40, -74)).to.equal(false);
    expect(bbox.contains(southAmerica, -34.61, 20)).to.equal(false);
  });
});
