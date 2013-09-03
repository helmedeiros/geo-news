'use strict';

var expect = require('chai').expect;
var geoNews = require('../../lib');
var portal = require('../../lib/src/domain/portal');
var inMemoryPortalRegistry = require('../../lib/src/adapters/in-memory-portal-registry');

function fakeFeed(byPortalId) {
  return {
    fetch: function (p, callback) {
      process.nextTick(function () {
        callback(null, byPortalId[p.id] || []);
      });
    }
  };
}

describe('wire(): indexAll + queryByRegion end-to-end', function () {
  it('indexes every portal then answers a publisher-mode query', function (done) {
    var clarin = portal.create({
      id: 'ar-clarin', name: 'Clarin', country: 'AR',
      city: 'Buenos Aires', lat: -34.6, lon: -58.4, rss: ''
    });
    var nyt = portal.create({
      id: 'us-nyt', name: 'NYT', country: 'US',
      city: 'New York', lat: 40.7, lon: -74.0, rss: ''
    });
    var feed = fakeFeed({
      'ar-clarin': [{
        id: 'ar-1', title: 'AR story', link: 'http://x/ar/1',
        summary: '', publishedAt: new Date(), portalId: 'ar-clarin'
      }],
      'us-nyt': [{
        id: 'us-1', title: 'US story', link: 'http://x/us/1',
        summary: '', publishedAt: new Date(), portalId: 'us-nyt'
      }]
    });
    var wired = geoNews.wire({
      feed: feed,
      portals: inMemoryPortalRegistry.create([clarin, nyt])
    });
    wired.indexAll.execute(function (err, result) {
      expect(err).to.equal(null);
      expect(result.savedCount).to.equal(2);
      wired.queryByRegion.execute(
        { mode: 'publisher', bbox: wired.regions.SOUTH_AMERICA.bbox },
        function (err2, items) {
          expect(err2).to.equal(null);
          expect(items).to.have.length(1);
          expect(items[0].title).to.equal('AR story');
          done();
        }
      );
    });
  });
});
