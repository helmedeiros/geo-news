'use strict';

var expect = require('chai').expect;
var indexNews = require('../../lib/src/application/index-news');
var inMemoryRepository = require('../../lib/src/adapters/in-memory-repository');
var portal = require('../../lib/src/domain/portal');

function fakeFeed(items, err) {
  return {
    fetch: function (p, callback) {
      process.nextTick(function () { callback(err || null, err ? null : items); });
    }
  };
}

var clarin = portal.create({
  id: 'ar-clarin', name: 'Clarin', country: 'AR',
  city: 'Buenos Aires', lat: -34.61, lon: -58.38, rss: ''
});

function item(id) {
  return {
    id: id, title: id, link: 'http://x/' + id, summary: '',
    publishedAt: new Date('2012-11-01T00:00:00Z'), portalId: 'ar-clarin'
  };
}

describe('IndexNewsUseCase', function () {
  it('stores every fetched item in the repository', function (done) {
    var repo = inMemoryRepository.create();
    var uc = indexNews.create({ feed: fakeFeed([item('a'), item('b')]), repository: repo });
    uc.execute(clarin, function (err, count) {
      expect(err).to.equal(null);
      expect(count).to.equal(2);
      repo.findAll(function (e, items) {
        expect(items).to.have.length(2);
        done();
      });
    });
  });

  it('returns 0 when the feed is empty', function (done) {
    var repo = inMemoryRepository.create();
    var uc = indexNews.create({ feed: fakeFeed([]), repository: repo });
    uc.execute(clarin, function (err, count) {
      expect(count).to.equal(0);
      done();
    });
  });

  it('propagates feed errors to the caller', function (done) {
    var uc = indexNews.create({
      feed: fakeFeed(null, new Error('boom')),
      repository: inMemoryRepository.create()
    });
    uc.execute(clarin, function (err) {
      expect(err.message).to.equal('boom');
      done();
    });
  });

  it('skips items older than the configured cut-off when a clock is wired', function (done) {
    var repo = inMemoryRepository.create();
    var fixed = new Date('2013-09-11T12:00:00Z');
    var clock = { now: function () { return fixed; } };
    var older = {
      id: 'old', title: 'old', link: 'http://x/old', summary: '',
      publishedAt: new Date('2013-08-01T00:00:00Z'),
      portalId: 'ar-clarin'
    };
    var newer = {
      id: 'new', title: 'new', link: 'http://x/new', summary: '',
      publishedAt: new Date('2013-09-11T00:00:00Z'),
      portalId: 'ar-clarin'
    };
    var uc = indexNews.create({
      feed: fakeFeed([older, newer]),
      repository: repo,
      clock: clock,
      maxAgeDays: 7
    });
    uc.execute(clarin, function (err, count) {
      expect(err).to.equal(null);
      expect(count).to.equal(1);
      done();
    });
  });
});
