'use strict';

var expect = require('chai').expect;
var geoNews = require('../lib');

describe('geo-news', function () {
  it('exposes a version string', function () {
    expect(geoNews.version).to.be.a('string');
    expect(geoNews.version).to.match(/^\d+\.\d+\.\d+$/);
  });
});
