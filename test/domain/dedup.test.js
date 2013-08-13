'use strict';

var expect = require('chai').expect;
var dedup = require('../../lib/src/domain/dedup');

describe('dedup.byId', function () {
  it('collapses duplicate ids keeping the last occurrence', function () {
    var items = [
      { id: 'a', title: 'first' },
      { id: 'b', title: 'one b' },
      { id: 'a', title: 'second' }
    ];
    var out = dedup.byId(items);
    expect(out).to.have.length(2);
    var byKey = {};
    out.forEach(function (i) { byKey[i.id] = i.title; });
    expect(byKey.a).to.equal('second');
    expect(byKey.b).to.equal('one b');
  });

  it('returns an empty array for empty input', function () {
    expect(dedup.byId([])).to.have.length(0);
  });
});
