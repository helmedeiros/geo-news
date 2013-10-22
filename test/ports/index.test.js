'use strict';

var expect = require('chai').expect;
var ports = require('../../lib/src/ports');

describe('ports index', function () {
  it('exposes every port contract', function () {
    expect(ports.newsFeed.isImplementation).to.be.a('function');
    expect(ports.newsRepository.isImplementation).to.be.a('function');
    expect(ports.portalRegistry.isImplementation).to.be.a('function');
    expect(ports.clock.isImplementation).to.be.a('function');
    expect(ports.locationExtractor.isImplementation).to.be.a('function');
    expect(ports.geocoder.isImplementation).to.be.a('function');
  });
});
