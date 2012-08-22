'use strict';

/**
 * Country — ISO 3166-1 alpha-2 code paired with a display name.
 *
 * Used by the portal registry to group portals by country and by the UI to
 * label markers and filters.
 */

function create(code, name) {
  return Object.freeze({
    code: code.toUpperCase(),
    name: name
  });
}

function equals(a, b) {
  return a.code === b.code;
}

module.exports = {
  create: create,
  equals: equals
};
