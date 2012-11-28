'use strict';

var expect = require('chai').expect;
var portalRegistryPort = require('../../lib/src/ports/portal-registry-port');

function fakeRegistry() {
  return {
    byId: function () {},
    byCountry: function () {},
    all: function () {}
  };
}

describe('PortalRegistryPort.isImplementation', function () {
  it('accepts an object exposing all three lookups', function () {
    expect(portalRegistryPort.isImplementation(fakeRegistry())).to.equal(true);
  });

  it('rejects an object missing one of the lookups', function () {
    var partial = fakeRegistry();
    delete partial.all;
    expect(portalRegistryPort.isImplementation(partial)).to.equal(false);
  });
});
