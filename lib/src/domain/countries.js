'use strict';

/**
 * Closed list of ISO 3166-1 alpha-2 codes for the Americas, paired with their
 * display names. This is the universe of countries the v1 portal registry will
 * cover. Membership is curated rather than derived to keep the registry small.
 */

var country = require('./country');

var ENTRIES = [
  ['US', 'United States'],
  ['CA', 'Canada'],
  ['MX', 'Mexico'],
  ['AR', 'Argentina'],
  ['BR', 'Brazil'],
  ['CL', 'Chile'],
  ['CO', 'Colombia'],
  ['PE', 'Peru'],
  ['VE', 'Venezuela'],
  ['EC', 'Ecuador'],
  ['BO', 'Bolivia'],
  ['PY', 'Paraguay'],
  ['UY', 'Uruguay'],
  ['GY', 'Guyana'],
  ['SR', 'Suriname'],
  ['GF', 'French Guiana']
];

var ALL = Object.freeze(ENTRIES.map(function (e) {
  return country.create(e[0], e[1]);
}));

function byCode(code) {
  var i;
  var upper = code.toUpperCase();
  for (i = 0; i < ALL.length; i++) {
    if (ALL[i].code === upper) { return ALL[i]; }
  }
  return null;
}

module.exports = {
  ALL: ALL,
  byCode: byCode
};
