'use strict';

var expect = require('chai').expect;
var nominatim = require('../../lib/src/adapters/nominatim-geocoder');
var geocoderPort = require('../../lib/src/ports/geocoder-port');

function fakeHttp(body, err) {
  return {
    get: function (url, callback) {
      process.nextTick(function () {
        callback(err || null, err ? null : body);
      });
    }
  };
}

describe('NominatimGeocoder', function () {
  it('satisfies the GeocoderPort contract', function () {
    var g = nominatim.create({ httpClient: fakeHttp('[]'), minGapMs: 0 });
    expect(geocoderPort.isImplementation(g)).to.equal(true);
  });

  it('returns the first hit parsed from the Nominatim JSON response', function (done) {
    var body = JSON.stringify([{ lat: '-34.6', lon: '-58.4', importance: 0.8 }]);
    var g = nominatim.create({ httpClient: fakeHttp(body), minGapMs: 0 });
    g.lookup('Buenos Aires', function (err, hit) {
      expect(err).to.equal(null);
      expect(hit.lat).to.equal(-34.6);
      expect(hit.lon).to.equal(-58.4);
      done();
    });
  });

  it('returns null when the response is an empty array', function (done) {
    var g = nominatim.create({ httpClient: fakeHttp('[]'), minGapMs: 0 });
    g.lookup('Atlantis', function (err, hit) {
      expect(hit).to.equal(null);
      done();
    });
  });
});
