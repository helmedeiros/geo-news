'use strict';

var expect = require('chai').expect;
var htmlEntities = require('../../lib/src/adapters/html-entities');

describe('htmlEntities.decode', function () {
  it('decodes named entities', function () {
    expect(htmlEntities.decode('AT&amp;T')).to.equal('AT&T');
    expect(htmlEntities.decode('Ol&aacute; is left alone')).to.contain('&aacute;');
    expect(htmlEntities.decode('5 &mdash; 6')).to.equal('5 — 6');
  });

  it('decodes decimal and hex numeric entities', function () {
    expect(htmlEntities.decode('&#233;')).to.equal('é');
    expect(htmlEntities.decode('&#x2014;')).to.equal('—');
  });

  it('returns non-string input unchanged', function () {
    expect(htmlEntities.decode(null)).to.equal(null);
  });
});
