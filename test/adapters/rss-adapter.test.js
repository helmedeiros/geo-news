'use strict';

var expect = require('chai').expect;
var rssAdapter = require('../../lib/src/adapters/rss-adapter');
var portal = require('../../lib/src/domain/portal');
var newsFeedPort = require('../../lib/src/ports/news-feed-port');

var clarin = portal.create({
  id: 'ar-clarin', name: 'Clarin', country: 'AR',
  city: 'Buenos Aires', lat: -34.61, lon: -58.38, rss: 'http://example.com/rss'
});

function fakeHttp(body, err) {
  return {
    get: function (url, callback) {
      process.nextTick(function () { callback(err || null, err ? null : body); });
    }
  };
}

function fakeParser(entries) {
  return { parse: function () { return entries; } };
}

describe('RssAdapter', function () {
  it('satisfies the NewsFeedPort contract', function () {
    var adapter = rssAdapter.create({
      httpClient: fakeHttp(''),
      parser: fakeParser([])
    });
    expect(newsFeedPort.isImplementation(adapter)).to.equal(true);
  });

  it('maps parsed entries to NewsItem-shaped objects with the portal id', function (done) {
    var entries = [
      {
        title: 'Hello', link: 'http://x/1', summary: 'lorem',
        publishedAt: new Date('2013-01-08T00:00:00Z')
      }
    ];
    var adapter = rssAdapter.create({
      httpClient: fakeHttp('<rss/>'),
      parser: fakeParser(entries)
    });
    adapter.fetch(clarin, function (err, items) {
      expect(err).to.equal(null);
      expect(items).to.have.length(1);
      expect(items[0].portalId).to.equal('ar-clarin');
      expect(items[0].id).to.equal('ar-clarin:x/1');
      done();
    });
  });

  it('strips scheme, query and trailing slash when canonicalising ids', function (done) {
    var entries = [{
      title: 't', link: 'https://example.com/path/?utm=1',
      summary: '', publishedAt: new Date()
    }];
    var adapter = rssAdapter.create({
      httpClient: fakeHttp('<rss/>'),
      parser: fakeParser(entries)
    });
    adapter.fetch(clarin, function (err, items) {
      expect(items[0].id).to.equal('ar-clarin:example.com/path');
      done();
    });
  });

  it('tags HTTP errors with code E_HTTP', function (done) {
    var adapter = rssAdapter.create({
      httpClient: fakeHttp(null, new Error('network')),
      parser: fakeParser([])
    });
    adapter.fetch(clarin, function (err) {
      expect(err.code).to.equal('E_HTTP');
      expect(err.cause.message).to.equal('network');
      done();
    });
  });

  it('tags parse failures with code E_PARSE', function (done) {
    var adapter = rssAdapter.create({
      httpClient: fakeHttp('not xml'),
      parser: { parse: function () { throw new Error('bad xml'); } }
    });
    adapter.fetch(clarin, function (err) {
      expect(err.code).to.equal('E_PARSE');
      done();
    });
  });
});
