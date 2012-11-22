'use strict';

var expect = require('chai').expect;
var queryByRegion = require('../../lib/src/application/query-by-region');
var inMemoryRepository = require('../../lib/src/adapters/in-memory-repository');
var bbox = require('../../lib/src/domain/bounding-box');
var portal = require('../../lib/src/domain/portal');
var newsItem = require('../../lib/src/domain/news-item');

var southAmerica = bbox.create(-60, -90, 15, -30);

var clarin = portal.create({
  id: 'ar-clarin', name: 'Clarin', country: 'AR',
  city: 'Buenos Aires', lat: -34.61, lon: -58.38, rss: ''
});
var nytimes = portal.create({
  id: 'us-nyt', name: 'NYT', country: 'US',
  city: 'New York', lat: 40.71, lon: -74.0, rss: ''
});

var portalsRegistry = {
  byId: function (id) {
    if (id === clarin.id) { return clarin; }
    if (id === nytimes.id) { return nytimes; }
    return null;
  }
};

function build(repoItems) {
  var repo = inMemoryRepository.create();
  repoItems.forEach(function (i) { repo.save(i, function () {}); });
  return queryByRegion.create({ repository: repo, portals: portalsRegistry });
}

describe('QueryByRegionUseCase (publisher mode)', function () {
  it('returns items whose portal is inside the bbox', function (done) {
    var insideItem = newsItem.create({
      id: '1', title: 'AR story', link: 'h',
      publishedAt: new Date(), portalId: clarin.id
    });
    var outsideItem = newsItem.create({
      id: '2', title: 'US story', link: 'h',
      publishedAt: new Date(), portalId: nytimes.id
    });
    var uc = build([insideItem, outsideItem]);
    uc.execute({ mode: 'publisher', bbox: southAmerica }, function (err, items) {
      expect(err).to.equal(null);
      expect(items).to.have.length(1);
      expect(items[0].id).to.equal('1');
      done();
    });
  });

  it('reports unknown modes as errors', function (done) {
    var uc = build([]);
    uc.execute({ mode: 'wat', bbox: southAmerica }, function (err) {
      expect(err.message).to.match(/unknown query mode/);
      done();
    });
  });
});
