#!/usr/bin/env node
'use strict';

/**
 * scripts/build-headlines-dataset.js
 *
 * Fetches the bundled portals once, runs the gazetteer extractor over the
 * returned items and writes `web/data/headlines.json`. The UI loads this file
 * first and falls back to `headlines.sample.json` when the build has not run.
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
var gazetteer = require('../lib/src/registry/gazetteer');

var TARGET = path.join(__dirname, '..', 'web', 'data', 'headlines.json');

var wired = geoNews.wire({
  feed: rssAdapter.create({
    httpClient: nodeHttpClient.create({ timeoutMs: 8000 }),
    parser: rssParser
  }),
  extractor: gazetteerExtractor.create({ gazetteer: gazetteer }),
  concurrency: 4
});

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
    fs.writeFileSync(TARGET, JSON.stringify(items, null, 2));
    console.log('wrote', items.length, 'items;',
      summary.failures.length, 'failures');
  });
});
