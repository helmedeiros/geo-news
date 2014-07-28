#!/usr/bin/env node
'use strict';

/**
 * scripts/sync-web-portals.js
 *
 * Reads the library's bundled portal registry and writes
 * `web/data/portals.sample.json` as a portalId → { name, country, city, lat,
 * lon } lookup that the UI uses to place markers and label popups. Kept in
 * sync so a live deploy never paints zero markers because of a stale subset.
 */

var fs = require('fs');
var path = require('path');

var SOURCES = [
  require('../lib/src/registry/portals.json'),
  require('../lib/src/registry/google-news-portals.json')
];
var TARGET = path.join(__dirname, '..', 'web', 'data', 'portals.sample.json');

var out = {};
SOURCES.forEach(function (doc) {
  Object.keys(doc).forEach(function (country) {
    doc[country].forEach(function (rec) {
      out[rec.id] = {
        lat: rec.lat,
        lon: rec.lon,
        name: rec.name,
        country: country,
        city: rec.city
      };
    });
  });
});

fs.writeFileSync(TARGET, JSON.stringify(out, null, 2) + '\n');
console.log('wrote', Object.keys(out).length, 'portals to', TARGET);
