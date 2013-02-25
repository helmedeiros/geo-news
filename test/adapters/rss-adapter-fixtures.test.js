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
