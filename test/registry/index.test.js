'use strict';

var expect = require('chai').expect;
var registry = require('../../lib/src/registry');

describe('registry index', function () {
  it('exposes the loader, validator, regions and gazetteer', function () {
    expect(registry.portals.fromBundled).to.be.a('function');
    expect(registry.validator.validate).to.be.a('function');
    expect(registry.regions.AMERICAS.id).to.equal('americas');
    expect(registry.gazetteer.find).to.be.a('function');
  });
});
