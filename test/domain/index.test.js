'use strict';

var expect = require('chai').expect;
var domain = require('../../lib/src/domain');

describe('domain index', function () {
  it('exposes every domain module under a stable namespace', function () {
    expect(domain.newsItem.create).to.be.a('function');
    expect(domain.portal.create).to.be.a('function');
    expect(domain.coordinate.create).to.be.a('function');
    expect(domain.boundingBox.create).to.be.a('function');
    expect(domain.region.create).to.be.a('function');
    expect(domain.country.create).to.be.a('function');
  });
});
