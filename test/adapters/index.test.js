'use strict';

var expect = require('chai').expect;
var adapters = require('../../lib/src/adapters');

describe('adapters index', function () {
  it('exposes every adapter and helper', function () {
    expect(adapters.inMemoryRepository.create).to.be.a('function');
    expect(adapters.inMemoryPortalRegistry.create).to.be.a('function');
    expect(adapters.systemClock.now).to.be.a('function');
    expect(adapters.rssAdapter.create).to.be.a('function');
    expect(adapters.rssParser.parse).to.be.a('function');
    expect(adapters.nodeHttpClient.create).to.be.a('function');
    expect(adapters.htmlEntities.decode).to.be.a('function');
    expect(adapters.feedErrors.http).to.be.a('function');
    expect(adapters.gazetteerExtractor.create).to.be.a('function');
    expect(adapters.nominatimGeocoder.create).to.be.a('function');
    expect(adapters.compositeExtractor.create).to.be.a('function');
    expect(adapters.ogExtractor.parse).to.be.a('function');
  });
});
