'use strict';

var expect = require('chai').expect;
var region = require('../../lib/src/domain/region');
var bbox = require('../../lib/src/domain/bounding-box');

describe('Region.create', function () {
  it('returns a frozen region with id, name and bbox', function () {
    var r = region.create({
      id: 'south-america',
      name: 'South America',
      bbox: bbox.create(-60, -90, 15, -30)
    });
    expect(r.id).to.equal('south-america');
    expect(r.name).to.equal('South America');
    expect(r.bbox.south).to.equal(-60);
    expect(Object.isFrozen(r)).to.equal(true);
  });
});
