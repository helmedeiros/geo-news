'use strict';

var expect = require('chai').expect;
var gazetteerExtractor = require('../../lib/src/adapters/gazetteer-extractor');
var gazetteer = require('../../lib/src/registry/gazetteer');
var port = require('../../lib/src/ports/location-extractor-port');

function build() {
  return gazetteerExtractor.create({ gazetteer: gazetteer });
}

describe('GazetteerExtractor', function () {
  it('satisfies the LocationExtractorPort contract', function () {
    expect(port.isImplementation(build())).to.equal(true);
  });

  it('extracts a city named in the title', function (done) {
    var item = {
      title: 'Lluvias intensas afectan a Buenos Aires y Córdoba',
      summary: ''
    };
    build().extract(item, function (err, locs) {
      expect(err).to.equal(null);
      var names = locs.map(function (l) { return l.name; });
      expect(names).to.contain('Buenos Aires');
      expect(names).to.contain('Córdoba');
      done();
    });
  });

  it('returns an empty array when no city is recognised', function (done) {
    build().extract({ title: 'Atlantis emerges from the sea', summary: '' }, function (err, locs) {
      expect(locs).to.have.length(0);
      done();
    });
  });

  it('avoids duplicating the same city when it appears twice', function (done) {
    var item = {
      title: 'Lima reacciona; Lima debate',
      summary: 'En Lima continúa el debate'
    };
    build().extract(item, function (err, locs) {
      var limas = locs.filter(function (l) { return l.name === 'Lima'; });
      expect(limas).to.have.length(1);
      done();
    });
  });
});
