'use strict';

/**
 * GeocoderPort — driven port that resolves a place name to coordinates when
 * the local gazetteer does not know it.
 *
 * Adapters implement:
 *   lookup(name, callback)
 *
 *   callback(err, hit) where hit is { name, lat, lon, confidence } or null
 *
 * Implementations are expected to be polite (throttle, cache) since they will
 * typically hit a third-party service.
 */

function isImplementation(candidate) {
  return !!(candidate && typeof candidate.lookup === 'function');
}

module.exports = {
  isImplementation: isImplementation
};
