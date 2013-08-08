'use strict';

var expect = require('chai').expect;
var indexAll = require('../../lib/src/application/index-all');
var portal = require('../../lib/src/domain/portal');

function fakePortals(portals) {
  return {
    byId: function () { return null; },
    byCountry: function () { return []; },
    all: function () { return portals.slice(); }
  };
}

function fakeIndexNews(perPortal) {
  return {
    execute: function (p, callback) {
      var result = perPortal[p.id] || { count: 0 };
      process.nextTick(function () {
        callback(result.err || null, result.err ? null : result.count);
      });
    }
  };
}

var alpha = portal.create({ id: 'a', name: 'A', country: 'AR', city: 'X', lat: 0, lon: 0, rss: '' });
var beta  = portal.create({ id: 'b', name: 'B', country: 'BR', city: 'Y', lat: 0, lon: 0, rss: '' });
var gamma = portal.create({ id: 'c', name: 'C', country: 'CL', city: 'Z', lat: 0, lon: 0, rss: '' });

describe('IndexAllUseCase', function () {
  it('aggregates counts across every portal in the registry', function (done) {
    var uc = indexAll.create({
      portals: fakePortals([alpha, beta, gamma]),
      indexNews: fakeIndexNews({ a: { count: 3 }, b: { count: 5 }, c: { count: 2 } }),
      concurrency: 2
    });
    uc.execute(function (err, result) {
      expect(err).to.equal(null);
      expect(result.savedCount).to.equal(10);
      expect(result.failures).to.have.length(0);
      done();
    });
  });

  it('isolates per-portal failures instead of aborting the batch', function (done) {
    var uc = indexAll.create({
      portals: fakePortals([alpha, beta]),
      indexNews: fakeIndexNews({
        a: { count: 4 },
        b: { err: new Error('boom') }
      })
    });
    uc.execute(function (err, result) {
      expect(err).to.equal(null);
      expect(result.savedCount).to.equal(4);
      expect(result.failures).to.have.length(1);
      expect(result.failures[0].portalId).to.equal('b');
      done();
    });
  });
});
