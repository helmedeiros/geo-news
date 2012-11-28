'use strict';

/**
 * PortalRegistryPort — driven port that hands portals to the application.
 *
 * Adapters implement:
 *   byId(portalId)              returns Portal | null
 *   byCountry(countryCode)      returns Array<Portal>
 *   all()                       returns Array<Portal>
 *
 * The registry is read-only at runtime; v1 ships a JSON-backed adapter, but
 * embedders may plug in their own (e.g. fetched from a config service).
 */

var REQUIRED = ['byId', 'byCountry', 'all'];

function isImplementation(candidate) {
  if (!candidate) { return false; }
  var i;
  for (i = 0; i < REQUIRED.length; i++) {
    if (typeof candidate[REQUIRED[i]] !== 'function') { return false; }
  }
  return true;
}

module.exports = {
  isImplementation: isImplementation
};
