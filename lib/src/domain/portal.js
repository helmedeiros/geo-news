'use strict';

/**
 * Portal — immutable value object describing a news source.
 *
 * Required attributes:
 *   id       {string}  short stable identifier (e.g. 'ar-clarin')
 *   name     {string}  display name (e.g. 'Clarín')
 *   country  {string}  ISO 3166-1 alpha-2 code (e.g. 'AR')
 *   city     {string}  name of the city where the portal is based
 *   lat      {number}  latitude of the portal's home city
 *   lon      {number}  longitude of the portal's home city
 *   rss      {string}  URL of the portal's main RSS or Atom feed
 */

function create(attrs) {
  return Object.freeze({
    id: attrs.id,
    name: attrs.name,
    country: attrs.country,
    city: attrs.city,
    lat: attrs.lat,
    lon: attrs.lon,
    rss: attrs.rss
  });
}

function equals(a, b) {
  return a.id === b.id;
}

module.exports = {
  create: create,
  equals: equals
};
