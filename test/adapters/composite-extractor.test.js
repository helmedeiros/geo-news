'use strict';

var expect = require('chai').expect;
var composite = require('../../lib/src/adapters/composite-extractor');

function primaryReturning(hits) {
  return {
    extract: function (item, callback) {
      process.nextTick(function () { callback(null, hits); });
    }
  };
}

function geocoderFor(known) {
  return {
    lookup: function (name, callback) {
      process.nextTick(function () {
        callback(null, known[name] || null);
      });
    }
  };
}

describe('CompositeExtractor', function () {
  it('returns primary hits unchanged when no geocoder is wired', function (done) {
    var c = composite.create({
      primary: primaryReturning([{ name: 'Lima', lat: -12, lon: -77, confidence: 0.7 }])
    });
    c.extract({ title: 't', summary: '' }, function (err, locs) {
      expect(err).to.equal(null);
      expect(locs).to.have.length(1);
      done();
    });
  });

  it('falls back to the geocoder for candidate names the primary missed', function (done) {
    var c = composite.create({
      primary: primaryReturning([]),
      geocoder: geocoderFor({
        'Atlantis': { name: 'Atlantis', lat: 0, lon: 0, confidence: 0.4 }
      })
    });
    c.extract({ title: 'Atlantis emerges', summary: '' }, function (err, locs) {
      expect(err).to.equal(null);
      var names = locs.map(function (l) { return l.name; });
      expect(names).to.contain('Atlantis');
      done();
    });
  });

  it('does not call the geocoder for names the primary already resolved', function (done) {
    var calls = 0;
    var geocoder = {
      lookup: function (name, callback) {
        calls = calls + 1;
        process.nextTick(function () { callback(null, null); });
      }
    };
    var c = composite.create({
      primary: primaryReturning([{ name: 'Lima', lat: -12, lon: -77, confidence: 0.7 }]),
      geocoder: geocoder
    });
    c.extract({ title: 'Lima sigue tranquila', summary: '' }, function () {
      expect(calls).to.equal(0);
      done();
    });
  });
});
