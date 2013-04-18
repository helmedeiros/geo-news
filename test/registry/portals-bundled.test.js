'use strict';

var expect = require('chai').expect;
var doc = require('../../lib/src/registry/portals.json');
var validator = require('../../lib/src/registry/portal-registry-validator');

describe('bundled portals.json', function () {
  it('validates against the registry schema', function () {
    var errors = validator.validate(doc);
    expect(errors).to.have.length(0);
  });

  it('lists every covered country with up to three portals', function () {
    var key;
    for (key in doc) {
      if (doc.hasOwnProperty(key)) {
        expect(doc[key].length).to.be.at.most(3);
        expect(doc[key].length).to.be.at.least(1);
      }
    }
  });
});
