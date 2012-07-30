'use strict';

/**
 * BoundingBox — immutable axis-aligned rectangle on the sphere.
 *
 * A box is described by its south, west, north and east edges. The constructor
 * does not handle anti-meridian wrap on purpose: a Pacific-spanning box must be
 * split into two boxes by the caller. Keeping that invariant out of the
 * geometry simplifies `contains` and the bbox-to-feed mapping later on.
 */

function create(south, west, north, east) {
  if (south > north) {
    throw new RangeError('south latitude must be <= north latitude');
  }
  if (west > east) {
    throw new RangeError('west longitude must be <= east longitude');
  }
  return Object.freeze({
    south: south,
    west: west,
    north: north,
    east: east
  });
}

function contains(b, lat, lon) {
  return lat >= b.south && lat <= b.north && lon >= b.west && lon <= b.east;
}

module.exports = {
  create: create,
  contains: contains
};
