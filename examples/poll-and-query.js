'use strict';

/**
 * Example: index every bundled portal once, then list the headlines whose
 * publishing city falls inside South America. Run with `node examples/poll-and-query.js`.
 *
 * For demo purposes the example wires the default Node http client and the
 * bundled RSS parser, so it does make real outbound requests. Replace the
 * `feed` injection with a fake to keep it offline.
 */

var geoNews = require('../');
var nodeHttpClient = require('../lib/src/adapters/node-http-client');
var rssAdapter = require('../lib/src/adapters/rss-adapter');
var rssParser = require('../lib/src/adapters/rss-parser');

var feed = rssAdapter.create({
  httpClient: nodeHttpClient.create({ timeoutMs: 8000 }),
  parser: rssParser
});

var wired = geoNews.wire({ feed: feed, concurrency: 3 });

wired.indexAll.execute(function (err, result) {
  if (err) {
    console.error('indexAll failed', err);
    process.exit(1);
  }
  console.log('saved', result.savedCount, 'items;', result.failures.length, 'failures');
  wired.queryByRegion.execute(
    { mode: 'publisher', bbox: wired.regions.SOUTH_AMERICA.bbox },
    function (qErr, items) {
      if (qErr) { return console.error(qErr); }
      items.slice(0, 20).forEach(function (i) {
        console.log('[' + i.portalId + '] ' + i.title);
      });
    }
  );
});
