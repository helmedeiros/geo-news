'use strict';

var expect = require('chai').expect;
var ogExtractor = require('../../lib/src/adapters/og-extractor');

var SAMPLE = [
  '<!DOCTYPE html><html><head>',
  '<title>Article</title>',
  '<meta name="description" content="standard meta description">',
  '<meta property="og:title" content="OG title">',
  '<meta property="og:description" content="OG lead paragraph">',
  '<meta property="og:image" content="https://example.com/cover.jpg">',
  '<meta content="https://example.com/twcard.jpg" property="twitter:image">',
  '</head><body>article body should be ignored</body></html>'
].join('\n');

describe('OgExtractor.parse', function () {
  it('prefers og:title, og:description and og:image', function () {
    var out = ogExtractor.parse(SAMPLE);
    expect(out.title).to.equal('OG title');
    expect(out.description).to.equal('OG lead paragraph');
    expect(out.image).to.equal('https://example.com/cover.jpg');
  });

  it('handles attribute-order variations (content before property)', function () {
    var html = '<head><meta content="https://x/y.png" property="og:image"></head>';
    expect(ogExtractor.parse(html).image).to.equal('https://x/y.png');
  });

  it('falls back to standard meta description when og:description is missing', function () {
    var html = '<head><meta name="description" content="fallback lead"></head>';
    expect(ogExtractor.parse(html).description).to.equal('fallback lead');
  });

  it('returns empty strings when nothing is present', function () {
    var out = ogExtractor.parse('<html><head></head><body></body></html>');
    expect(out.title).to.equal('');
    expect(out.description).to.equal('');
    expect(out.image).to.equal('');
  });

  it('ignores tags that appear after </head>', function () {
    var html = '<head></head><body><meta property="og:image" content="leaked.jpg"></body>';
    expect(ogExtractor.parse(html).image).to.equal('');
  });

  it('rejects non-string input', function () {
    expect(function () { ogExtractor.parse(null); }).to['throw'](TypeError);
  });
});

describe('OgExtractor.create', function () {
  it('forwards HTTP errors to the caller', function (done) {
    var fakeHttp = {
      get: function (url, cb) {
        process.nextTick(function () { cb(new Error('network')); });
      }
    };
    var ext = ogExtractor.create({ httpClient: fakeHttp });
    ext.extract('http://x/y', function (err) {
      expect(err.message).to.equal('network');
      done();
    });
  });

  it('returns parsed metadata on success', function (done) {
    var fakeHttp = {
      get: function (url, cb) {
        process.nextTick(function () { cb(null, SAMPLE); });
      }
    };
    var ext = ogExtractor.create({ httpClient: fakeHttp });
    ext.extract('http://x/y', function (err, meta) {
      expect(err).to.equal(null);
      expect(meta.title).to.equal('OG title');
      done();
    });
  });
});
