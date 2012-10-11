'use strict';

var expect = require('chai').expect;
var newsRepositoryPort = require('../../lib/src/ports/news-repository-port');

function fakeRepo() {
  return {
    save: function () {},
    findById: function () {},
    findAll: function () {},
    findByPortal: function () {}
  };
}

describe('NewsRepositoryPort.isImplementation', function () {
  it('accepts an object exposing all required operations', function () {
    expect(newsRepositoryPort.isImplementation(fakeRepo())).to.equal(true);
  });

  it('rejects an object missing any of the required operations', function () {
    var partial = fakeRepo();
    delete partial.findByPortal;
    expect(newsRepositoryPort.isImplementation(partial)).to.equal(false);
  });
});
