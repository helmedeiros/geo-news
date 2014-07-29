#!/usr/bin/env node
'use strict';

/**
 * scripts/build-headlines-dataset.js
 *
 * Fetches the bundled portals once, runs the gazetteer extractor over the
 * returned items and writes `web/data/headlines.json`. After indexing, the
 * top OG_LIMIT newest items are enriched with OpenGraph metadata (image,
 * description) so the UI can render a click-to-preview panel without ever
 * re-fetching the publisher's article body.
 *
 * Intended to be invoked during a Pages deploy or a periodic cron.
 */

var fs = require('fs');
var path = require('path');
var geoNews = require('../lib');
var rssAdapter = require('../lib/src/adapters/rss-adapter');
var rssParser = require('../lib/src/adapters/rss-parser');
var nodeHttpClient = require('../lib/src/adapters/node-http-client');
var gazetteerExtractor = require('../lib/src/adapters/gazetteer-extractor');
var ogExtractor = require('../lib/src/adapters/og-extractor');
var gazetteer = require('../lib/src/registry/gazetteer');

var TARGET = path.join(__dirname, '..', 'web', 'data', 'headlines.json');
var OG_LIMIT = 400;
var OG_CONCURRENCY = 8;

var wired = geoNews.wire({
  feed: rssAdapter.create({
    httpClient: nodeHttpClient.create({ timeoutMs: 8000 }),
    parser: rssParser
  }),
  extractor: gazetteerExtractor.create({ gazetteer: gazetteer }),
  concurrency: 4
});

var og = ogExtractor.create({
  httpClient: nodeHttpClient.create({ timeoutMs: 6000, maxRedirects: 4 })
});

function enrichAll(items, done) {
  var sorted = items.slice().sort(function (a, b) {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
  var queue = sorted.slice(0, OG_LIMIT);
  var inFlight = 0;
  var idx = 0;
  var ok = 0;
  var failed = 0;

  function pump() {
    if (idx >= queue.length && inFlight === 0) {
      return done({ ok: ok, failed: failed, attempted: queue.length });
    }
    while (inFlight < OG_CONCURRENCY && idx < queue.length) {
      runOne(queue[idx]);
      idx = idx + 1;
    }
  }

  function runOne(item) {
    inFlight = inFlight + 1;
    og.extract(item.link, function (err, meta) {
      inFlight = inFlight - 1;
      if (!err && meta) {
        if (meta.image)       { item.image = meta.image; }
        if (meta.description) { item.preview = meta.description; }
        ok = ok + 1;
      } else {
        failed = failed + 1;
      }
      pump();
    });
  }

  pump();
}

wired.indexAll.execute(function (err, summary) {
  if (err) {
    console.error('indexAll failed:', err);
    process.exit(1);
  }
  wired.repository.findAll(function (findErr, items) {
    if (findErr) {
      console.error('findAll failed:', findErr);
      process.exit(1);
    }
    console.log('indexed', items.length, 'items;',
      summary.failures.length, 'portal failures');
    console.log('fetching OG metadata for the newest', OG_LIMIT, 'items…');
    enrichAll(items, function (ogSummary) {
      console.log('OG enriched:', ogSummary.ok, 'ok,',
        ogSummary.failed, 'failed of', ogSummary.attempted);
      fs.writeFileSync(TARGET, JSON.stringify(items, null, 2));
      console.log('wrote', items.length, 'items to', TARGET);
    });
  });
});
