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
