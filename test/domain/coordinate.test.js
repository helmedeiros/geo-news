'use strict';

var expect = require('chai').expect;
var coordinate = require('../../lib/src/domain/coordinate');

describe('Coordinate.create', function () {
  it('returns a frozen lat/lon pair', function () {
    var c = coordinate.create(-34.61, -58.38);
    expect(c.lat).to.equal(-34.61);
    expect(c.lon).to.equal(-58.38);
    expect(Object.isFrozen(c)).to.equal(true);
  });

  it('rejects latitudes outside [-90, 90]', function () {
    expect(function () { coordinate.create(91, 0); }).to['throw'](RangeError);
    expect(function () { coordinate.create(-91, 0); }).to['throw'](RangeError);
  });

  it('rejects longitudes outside [-180, 180]', function () {
    expect(function () { coordinate.create(0, 181); }).to['throw'](RangeError);
    expect(function () { coordinate.create(0, -181); }).to['throw'](RangeError);
  });
});

describe('Coordinate.equals', function () {
  it('returns true when both components match', function () {
    var a = coordinate.create(10, 20);
    var b = coordinate.create(10, 20);
    expect(coordinate.equals(a, b)).to.equal(true);
  });

  it('returns false when any component differs', function () {
    var a = coordinate.create(10, 20);
    var b = coordinate.create(10, 21);
    expect(coordinate.equals(a, b)).to.equal(false);
  });
});
