'use strict';

var expect = require('chai').expect;
var newsItem = require('../../lib/src/domain/news-item');

function sample(overrides) {
  var base = {
    id: 'ar-clarin-1',
    title: 'Hello',
    link: 'http://example.com/1',
    summary: 'Lorem ipsum',
    publishedAt: new Date('2012-07-01T12:00:00Z'),
    portalId: 'ar-clarin'
  };
  if (!overrides) { return base; }
  var key;
  for (key in overrides) {
    if (overrides.hasOwnProperty(key)) { base[key] = overrides[key]; }
  }
  return base;
}

describe('NewsItem.create', function () {
  it('returns a frozen object carrying the given attributes', function () {
    var item = newsItem.create(sample());
    expect(item.id).to.equal('ar-clarin-1');
    expect(item.title).to.equal('Hello');
    expect(item.portalId).to.equal('ar-clarin');
    expect(Object.isFrozen(item)).to.equal(true);
  });

  it('defaults summary to an empty string when omitted', function () {
    var item = newsItem.create(sample({ summary: undefined }));
    expect(item.summary).to.equal('');
  });
});

describe('NewsItem.equals', function () {
  it('returns true when ids match regardless of other fields', function () {
    var a = newsItem.create(sample({ title: 'A' }));
    var b = newsItem.create(sample({ title: 'B' }));
    expect(newsItem.equals(a, b)).to.equal(true);
  });

  it('returns false when ids differ', function () {
    var a = newsItem.create(sample({ id: '1' }));
    var b = newsItem.create(sample({ id: '2' }));
    expect(newsItem.equals(a, b)).to.equal(false);
  });
});

describe('NewsItem.byPublishedAtDesc', function () {
  it('sorts newer items before older ones', function () {
    var older = newsItem.create(sample({
      id: 'a', publishedAt: new Date('2012-07-01T00:00:00Z')
    }));
    var newer = newsItem.create(sample({
      id: 'b', publishedAt: new Date('2012-07-02T00:00:00Z')
    }));
    var sorted = [older, newer].sort(newsItem.byPublishedAtDesc);
    expect(sorted[0].id).to.equal('b');
    expect(sorted[1].id).to.equal('a');
  });
});
