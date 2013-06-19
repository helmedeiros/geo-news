'use strict';

/**
 * Pure geometric helpers. Kept separate from the bounding-box value object so
 * that callers can reach for distance/bearing math without dragging in the
 * full domain index.
 */

var EARTH_RADIUS_KM = 6371;

function toRadians(deg) {
  return deg * Math.PI / 180;
}

function haversineKm(latA, lonA, latB, lonB) {
  var dLat = toRadians(latB - latA);
  var dLon = toRadians(lonB - lonA);
  var rA = toRadians(latA);
  var rB = toRadians(latB);
  var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) * Math.sin(dLon / 2) *
          Math.cos(rA) * Math.cos(rB);
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

module.exports = {
  haversineKm: haversineKm,
  toRadians: toRadians,
  EARTH_RADIUS_KM: EARTH_RADIUS_KM
};
