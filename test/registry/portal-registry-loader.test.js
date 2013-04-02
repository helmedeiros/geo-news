'use strict';

var expect = require('chai').expect;
var loader = require('../../lib/src/registry/portal-registry-loader');

describe('portalRegistryLoader.fromDocument', function () {
  it('flattens the country-keyed document into Portal value objects', function () {
    var portals = loader.fromDocument({
      AR: [{
        id: 'ar-clarin', name: 'Clarin',
        city: 'Buenos Aires', lat: -34.61, lon: -58.38, rss: ''
      }],
      BR: [{
        id: 'br-folha', name: 'Folha',
        city: 'Sao Paulo', lat: -23.55, lon: -46.63, rss: ''
      }]
    });
    expect(portals).to.have.length(2);
    expect(portals[0].country).to.equal('AR');
    expect(portals[1].country).to.equal('BR');
  });
});

describe('portalRegistryLoader.fromBundled', function () {
  it('reads the bundled portals.json without crashing', function () {
    var portals = loader.fromBundled();
    expect(portals).to.be.an('array');
  });
});
