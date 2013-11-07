'use strict';

var expect = require('chai').expect;
var extractLocations = require('../../lib/src/application/extract-locations');
var inMemoryRepository = require('../../lib/src/adapters/in-memory-repository');
var newsItem = require('../../lib/src/domain/news-item');

function fakeExtractor(byTitle) {
  return {
    extract: function (item, callback) {
      process.nextTick(function () {
        callback(null, byTitle[item.title] || []);
      });
    }
  };
}

function makeItem(id, title) {
  return newsItem.create({
    id: id, title: title, link: 'http://x/' + id, summary: '',
    publishedAt: new Date('2013-11-07T00:00:00Z'), portalId: 'p'
  });
}

describe('ExtractLocationsUseCase.execute', function () {
  it('persists an enriched copy of the item with extracted locations', function (done) {
    var repo = inMemoryRepository.create();
    var uc = extractLocations.create({
      repository: repo,
      extractor: fakeExtractor({
        'Buenos Aires today': [{ name: 'Buenos Aires', lat: -34.6, lon: -58.4, confidence: 0.7 }]
      })
    });
    var item = makeItem('1', 'Buenos Aires today');
    uc.execute(item, function (err) {
      expect(err).to.equal(null);
      repo.findById('1', function (e, stored) {
        expect(stored.extractedLocations).to.have.length(1);
        expect(stored.extractedLocations[0].name).to.equal('Buenos Aires');
        done();
      });
    });
  });
});

describe('ExtractLocationsUseCase.executeAll', function () {
  it('runs over every item in the repository', function (done) {
    var repo = inMemoryRepository.create();
    repo.save(makeItem('1', 'Buenos Aires today'), function () {
      repo.save(makeItem('2', 'Lima quiet'), function () {
        var uc = extractLocations.create({
          repository: repo,
          extractor: fakeExtractor({
            'Buenos Aires today': [{ name: 'Buenos Aires', lat: -34.6, lon: -58.4, confidence: 0.7 }],
            'Lima quiet': [{ name: 'Lima', lat: -12, lon: -77, confidence: 0.7 }]
          })
        });
        uc.executeAll(function (err, count) {
          expect(err).to.equal(null);
          expect(count).to.equal(2);
          done();
        });
      });
    });
  });
});
