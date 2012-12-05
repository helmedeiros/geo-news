'use strict';

/**
 * InMemoryPortalRegistry — PortalRegistryPort adapter backed by an in-memory
 * array of Portal value objects. Used by tests and as the default when the
 * curated JSON registry is loaded eagerly at startup.
 */

function create(portals) {
  var snapshot = (portals || []).slice();

  function byId(id) {
    var i;
    for (i = 0; i < snapshot.length; i++) {
      if (snapshot[i].id === id) { return snapshot[i]; }
    }
    return null;
  }

  function byCountry(code) {
    var upper = code.toUpperCase();
    return snapshot.filter(function (p) { return p.country === upper; });
  }

  function all() {
    return snapshot.slice();
  }

  return {
    byId: byId,
    byCountry: byCountry,
    all: all
  };
}

module.exports = {
  create: create
};
