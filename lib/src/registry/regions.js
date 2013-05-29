'use strict';

/**
 * Curated regions of the Americas. The v1 UI uses them as preset map views.
 */

var bbox = require('../domain/bounding-box');
var region = require('../domain/region');

var AMERICAS = region.create({
  id: 'americas',
  name: 'Americas',
  bbox: bbox.create(-60, -170, 75, -30)
});

var NORTH_AMERICA = region.create({
  id: 'north-america',
  name: 'North America',
  bbox: bbox.create(15, -170, 75, -50)
});

var SOUTH_AMERICA = region.create({
  id: 'south-america',
  name: 'South America',
  bbox: bbox.create(-60, -90, 15, -30)
});

var ALL = Object.freeze([AMERICAS, NORTH_AMERICA, SOUTH_AMERICA]);

function byId(id) {
  var i;
  for (i = 0; i < ALL.length; i++) {
    if (ALL[i].id === id) { return ALL[i]; }
  }
  return null;
}

module.exports = {
  AMERICAS: AMERICAS,
  NORTH_AMERICA: NORTH_AMERICA,
  SOUTH_AMERICA: SOUTH_AMERICA,
  ALL: ALL,
  byId: byId
};
