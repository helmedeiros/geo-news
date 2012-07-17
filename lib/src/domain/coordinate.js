'use strict';

/**
 * Coordinate — immutable lat/lon pair.
 *
 * Latitudes are clamped within [-90, 90]; longitudes within [-180, 180].
 * Values outside these ranges throw a RangeError so that bad data is caught
 * at the boundary rather than corrupting downstream geometry.
 */

function create(lat, lon) {
  if (lat < -90 || lat > 90) {
    throw new RangeError('latitude out of range: ' + lat);
  }
  if (lon < -180 || lon > 180) {
    throw new RangeError('longitude out of range: ' + lon);
  }
  return Object.freeze({ lat: lat, lon: lon });
}

function equals(a, b) {
  return a.lat === b.lat && a.lon === b.lon;
}

module.exports = {
  create: create,
  equals: equals
};
