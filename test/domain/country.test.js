'use strict';

var expect = require('chai').expect;
var country = require('../../lib/src/domain/country');

describe('Country.create', function () {
  it('uppercases the ISO code', function () {
    var c = country.create('ar', 'Argentina');
    expect(c.code).to.equal('AR');
    expect(c.name).to.equal('Argentina');
    expect(Object.isFrozen(c)).to.equal(true);
  });
});

describe('Country.equals', function () {
  it('compares by code regardless of case', function () {
    var a = country.create('AR', 'Argentina');
    var b = country.create('ar', 'Argentina (alias)');
    expect(country.equals(a, b)).to.equal(true);
  });
});
