'use strict';

/**
 * examples/embed.js — proves the "any company can embed it" promise.
 *
 * In under 50 LOC we:
 *   - bring our own portals (no bundled registry),
 *   - bring our own feed adapter (one in-memory record per portal),
 *   - reuse the bundled gazetteer extractor for event mode,
 *   - reuse the bundled in-memory repository,
 *   - run indexAll, then queryByRegion in both publisher and event mode.
 *
 * Run with: `node examples/embed.js`
 */

var geoNews = require('../');
var portal = require('../lib/src/domain/portal');
var bbox = require('../lib/src/domain/bounding-box');
var inMemoryPortalRegistry = require('../lib/src/adapters/in-memory-portal-registry');
var gazetteerExtractor = require('../lib/src/adapters/gazetteer-extractor');
var gazetteer = require('../lib/src/registry/gazetteer');

var portals = [
  portal.create({
    id: 'demo-ba', name: 'Demo Buenos Aires', country: 'AR',
    city: 'Buenos Aires', lat: -34.6, lon: -58.4, rss: 'demo://ba'
  }),
  portal.create({
    id: 'demo-ny', name: 'Demo New York', country: 'US',
    city: 'New York', lat: 40.7, lon: -74.0, rss: 'demo://ny'
  })
];

var byPortal = {
  'demo-ba': [{ id: 'a', title: 'Vida en Buenos Aires', link: 'demo://a',
                summary: '', publishedAt: new Date(), portalId: 'demo-ba' }],
  'demo-ny': [{ id: 'b', title: 'Buenos Aires in the spotlight', link: 'demo://b',
                summary: '', publishedAt: new Date(), portalId: 'demo-ny' }]
};

var fakeFeed = { fetch: function (p, cb) { cb(null, byPortal[p.id] || []); } };

var wired = geoNews.wire({
  feed: fakeFeed,
  portals: inMemoryPortalRegistry.create(portals),
  extractor: gazetteerExtractor.create({ gazetteer: gazetteer })
});

var sa = bbox.create(-60, -90, 15, -30);
wired.indexAll.execute(function () {
  wired.queryByRegion.execute({ mode: 'publisher', bbox: sa }, function (e, p1) {
    console.log('publisher SA:', p1.map(function (i) { return i.title; }));
    wired.queryByRegion.execute({ mode: 'event', bbox: sa }, function (e2, p2) {
      console.log('event SA:    ', p2.map(function (i) { return i.title; }));
    });
  });
});
