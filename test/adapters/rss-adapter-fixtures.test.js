'use strict';

var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var rssAdapter = require('../../lib/src/adapters/rss-adapter');
var rssParser = require('../../lib/src/adapters/rss-parser');
var portal = require('../../lib/src/domain/portal');

function loadFixture(name) {
  return fs.readFileSync(path.join(__dirname, '..', 'fixtures', name), 'utf8');
}

function fakeHttp(body) {
  return {
    get: function (url, callback) {
      process.nextTick(function () { callback(null, body); });
    }
  };
}

var clarin = portal.create({
  id: 'ar-clarin', name: 'Clarin', country: 'AR',
  city: 'Buenos Aires', lat: -34.61, lon: -58.38,
  rss: 'http://example.com/clarin/rss'
});

var nyt = portal.create({
  id: 'us-nyt', name: 'NYT', country: 'US',
  city: 'New York', lat: 40.71, lon: -74.0,
  rss: 'http://example.com/nyt/world.xml'
});

describe('RssAdapter against Clarín-style RSS', function () {
  it('extracts every story with portal id and canonical id', function (done) {
    var adapter = rssAdapter.create({
      httpClient: fakeHttp(loadFixture('clarin-style.xml')),
      parser: rssParser
    });
    adapter.fetch(clarin, function (err, items) {
      expect(err).to.equal(null);
      expect(items).to.have.length(2);
      items.forEach(function (i) {
        expect(i.portalId).to.equal('ar-clarin');
        expect(i.id).to.match(/^ar-clarin:/);
      });
      expect(items[0].title).to.equal('Argentina rumbo a las elecciones');
      done();
    });
  });
});

describe('RssAdapter against NYT-style Atom', function () {
  it('reads <entry>, <link href=...> and <summary>', function (done) {
    var adapter = rssAdapter.create({
      httpClient: fakeHttp(loadFixture('nyt-style-atom.xml')),
      parser: rssParser
    });
    adapter.fetch(nyt, function (err, items) {
      expect(err).to.equal(null);
      expect(items).to.have.length(2);
      expect(items[0].title).to.equal('Senate debates new bill');
      expect(items[0].link).to.equal('http://example.com/nyt/world/senate-bill');
      expect(items[0].portalId).to.equal('us-nyt');
      done();
    });
  });
});
