'use strict';

var expect = require('chai').expect;
var geoNews = require('../../lib');
var portal = require('../../lib/src/domain/portal');
var inMemoryPortalRegistry = require('../../lib/src/adapters/in-memory-portal-registry');
var gazetteerExtractor = require('../../lib/src/adapters/gazetteer-extractor');
var gazetteer = require('../../lib/src/registry/gazetteer');

function fakeFeed(byPortalId) {
  return {
    fetch: function (p, callback) {
      process.nextTick(function () { callback(null, byPortalId[p.id] || []); });
    }
  };
}

describe('event mode end-to-end', function () {
  it('returns a US-published story about Buenos Aires under a SA bbox', function (done) {
    var nyt = portal.create({
      id: 'us-nyt', name: 'NYT', country: 'US',
      city: 'New York', lat: 40.7, lon: -74.0, rss: ''
    });
    var feed = fakeFeed({
      'us-nyt': [{
        id: 'nyt-1',
        title: 'Buenos Aires reacts to new policy',
        link: 'http://example.com/nyt/buenos-aires',
        summary: '', publishedAt: new Date(), portalId: 'us-nyt'
      }]
    });
    var wired = geoNews.wire({
      feed: feed,
      portals: inMemoryPortalRegistry.create([nyt]),
      extractor: gazetteerExtractor.create({ gazetteer: gazetteer })
    });
    wired.indexAll.execute(function (err) {
      expect(err).to.equal(null);
      wired.queryByRegion.execute(
        { mode: 'event', bbox: wired.regions.SOUTH_AMERICA.bbox },
        function (qErr, items) {
          expect(qErr).to.equal(null);
          expect(items).to.have.length(1);
          expect(items[0].id).to.equal('nyt-1');
          done();
        }
      );
    });
  });
});
