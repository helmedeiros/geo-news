'use strict';

var expect = require('chai').expect;
var countries = require('../../lib/src/domain/countries');

describe('countries.ALL', function () {
  it('covers the sixteen v1 Americas countries', function () {
    expect(countries.ALL).to.have.length(16);
  });

  it('exposes Argentina and Brazil among its entries', function () {
    var codes = countries.ALL.map(function (c) { return c.code; });
    expect(codes).to.include('AR');
    expect(codes).to.include('BR');
    expect(codes).to.include('US');
  });
});

describe('countries.byCode', function () {
  it('finds a country by its ISO code, case-insensitively', function () {
    expect(countries.byCode('ar').name).to.equal('Argentina');
    expect(countries.byCode('BR').name).to.equal('Brazil');
  });

  it('returns null for unknown codes', function () {
    expect(countries.byCode('ZZ')).to.equal(null);
  });
});
