'use strict';

var expect = require('chai').expect;
var geoNews = require('../lib');

describe('geo-news', function () {
  it('exposes a version string', function () {
    expect(geoNews.version).to.be.a('string');
    expect(geoNews.version).to.match(/^\d+\.\d+\.\d+$/);
  });

  it('re-exports domain, application and default adapters', function () {
    expect(geoNews.domain.newsItem.create).to.be.a('function');
    expect(geoNews.application.queryByRegion.create).to.be.a('function');
    expect(geoNews.adapters.inMemoryRepository.create).to.be.a('function');
  });

  it('wires a composition root with sensible defaults', function () {
    var wired = geoNews.wire({});
    expect(wired.indexNews.execute).to.be.a('function');
    expect(wired.queryByRegion.execute).to.be.a('function');
  });
});
