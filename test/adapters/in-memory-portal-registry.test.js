'use strict';

var expect = require('chai').expect;
var inMemoryPortalRegistry = require('../../lib/src/adapters/in-memory-portal-registry');
var portalRegistryPort = require('../../lib/src/ports/portal-registry-port');
var portal = require('../../lib/src/domain/portal');

var clarin = portal.create({
  id: 'ar-clarin', name: 'Clarin', country: 'AR',
  city: 'Buenos Aires', lat: -34.61, lon: -58.38, rss: ''
});
var pagina = portal.create({
  id: 'ar-pagina12', name: 'Pagina/12', country: 'AR',
  city: 'Buenos Aires', lat: -34.61, lon: -58.38, rss: ''
});
var nyt = portal.create({
  id: 'us-nyt', name: 'NYT', country: 'US',
  city: 'New York', lat: 40.71, lon: -74.0, rss: ''
});

describe('InMemoryPortalRegistry', function () {
  var registry;

  beforeEach(function () {
    registry = inMemoryPortalRegistry.create([clarin, pagina, nyt]);
  });

  it('satisfies the PortalRegistryPort contract', function () {
    expect(portalRegistryPort.isImplementation(registry)).to.equal(true);
  });

  it('finds a portal by id', function () {
    expect(registry.byId('ar-clarin').name).to.equal('Clarin');
    expect(registry.byId('missing')).to.equal(null);
  });

  it('lists portals by country (case-insensitive)', function () {
    expect(registry.byCountry('ar')).to.have.length(2);
    expect(registry.byCountry('US')).to.have.length(1);
  });

  it('returns a defensive copy from all()', function () {
    var listed = registry.all();
    listed.length = 0;
    expect(registry.all()).to.have.length(3);
  });
});
