'use strict';

var expect = require('chai').expect;
var newsFeedPort = require('../../lib/src/ports/news-feed-port');

describe('NewsFeedPort.isImplementation', function () {
  it('accepts any object exposing a fetch function', function () {
    var fake = { fetch: function () {} };
    expect(newsFeedPort.isImplementation(fake)).to.equal(true);
  });

  it('rejects objects without a fetch function', function () {
    expect(newsFeedPort.isImplementation({})).to.equal(false);
    expect(newsFeedPort.isImplementation(null)).to.equal(false);
    expect(newsFeedPort.isImplementation(undefined)).to.equal(false);
  });
});
