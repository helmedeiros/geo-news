'use strict';

var expect = require('chai').expect;
var inMemoryRepository = require('../../lib/src/adapters/in-memory-repository');
var newsItem = require('../../lib/src/domain/news-item');
var newsRepositoryPort = require('../../lib/src/ports/news-repository-port');

function sampleItem(overrides) {
  var defaults = {
    id: 'ar-clarin-1',
    title: 'Hello',
    link: 'http://example.com/1',
    publishedAt: new Date('2012-10-01T12:00:00Z'),
    portalId: 'ar-clarin'
  };
  var key;
  for (key in overrides) {
    if (overrides.hasOwnProperty(key)) { defaults[key] = overrides[key]; }
  }
  return newsItem.create(defaults);
}

describe('InMemoryRepository', function () {
  var repo;

  beforeEach(function () {
    repo = inMemoryRepository.create();
  });

  it('satisfies the NewsRepositoryPort contract', function () {
    expect(newsRepositoryPort.isImplementation(repo)).to.equal(true);
  });

  it('saves and finds an item by id', function (done) {
    repo.save(sampleItem(), function (saveErr) {
      expect(saveErr).to.equal(null);
      repo.findById('ar-clarin-1', function (err, found) {
        expect(err).to.equal(null);
        expect(found.title).to.equal('Hello');
        done();
      });
    });
  });

  it('returns null when looking up an unknown id', function (done) {
    repo.findById('missing', function (err, found) {
      expect(err).to.equal(null);
      expect(found).to.equal(null);
      done();
    });
  });

  it('replaces existing items on second save with the same id', function (done) {
    repo.save(sampleItem({ title: 'First' }), function () {
      repo.save(sampleItem({ title: 'Second' }), function () {
        repo.findAll(function (err, items) {
          expect(items).to.have.length(1);
          expect(items[0].title).to.equal('Second');
          done();
        });
      });
    });
  });

  it('finds items by portal id', function (done) {
    repo.save(sampleItem({ id: 'a', portalId: 'p1' }), function () {
      repo.save(sampleItem({ id: 'b', portalId: 'p2' }), function () {
        repo.save(sampleItem({ id: 'c', portalId: 'p1' }), function () {
          repo.findByPortal('p1', function (err, items) {
            expect(err).to.equal(null);
            expect(items).to.have.length(2);
            done();
          });
        });
      });
    });
  });
});
