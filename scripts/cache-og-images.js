#!/usr/bin/env node
'use strict';

/**
 * scripts/cache-og-images.js
 *
 * Reads `web/data/headlines.json`, downloads every item.image into
 * `web/data/og/{hash}.{ext}`, and rewrites item.image to the local path.
 * Run after build-headlines-dataset.js (the deploy script invokes both).
 *
 * Goal: stop hot-linking publisher CDNs. Once the image lives next to the
 * site, broken-thumbnail rot from off-origin 403s goes away and the deploy
 * is a self-contained artefact.
 */

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var binaryHttpClient = require('../lib/src/adapters/binary-http-client');

var TARGET = path.join(__dirname, '..', 'web', 'data', 'headlines.json');
var CACHE_DIR = path.join(__dirname, '..', 'web', 'data', 'og');
var PUBLIC_PREFIX = 'data/og/';
var CONCURRENCY = 6;

var EXT_BY_TYPE = {
  'image/jpeg': '.jpg',
  'image/jpg':  '.jpg',
  'image/png':  '.png',
  'image/gif':  '.gif',
  'image/webp': '.webp',
  'image/avif': '.avif'
};

function extensionFor(contentType, url) {
  if (EXT_BY_TYPE[contentType]) { return EXT_BY_TYPE[contentType]; }
  var m = url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|avif)(?:\?|$)/);
  return m ? '.' + m[1].replace('jpeg', 'jpg') : '.img';
}

function hash(url) {
  return crypto.createHash('sha1').update(url).digest('hex').slice(0, 16);
}

function ensureDir() {
  if (!fs.existsSync(CACHE_DIR)) { fs.mkdirSync(CACHE_DIR, { recursive: true }); }
}

function loadItems() { return JSON.parse(fs.readFileSync(TARGET, 'utf8')); }
function writeItems(items) { fs.writeFileSync(TARGET, JSON.stringify(items, null, 2)); }

function cacheAll(items, done) {
  ensureDir();
  var http = binaryHttpClient.create({ timeoutMs: 6000, maxRedirects: 4, maxBytes: 2000000 });
  var queue = items.filter(function (i) {
    return i.image && i.image.indexOf('http') === 0;
  });
  var inFlight = 0;
  var idx = 0;
  var ok = 0;
  var failed = 0;

  function pump() {
    if (idx >= queue.length && inFlight === 0) {
      return done({ ok: ok, failed: failed, attempted: queue.length });
    }
    while (inFlight < CONCURRENCY && idx < queue.length) {
      runOne(queue[idx]);
      idx = idx + 1;
    }
  }

  function runOne(item) {
    inFlight = inFlight + 1;
    http.get(item.image, function (err, res) {
      inFlight = inFlight - 1;
      if (err || !res || !res.body || res.body.length === 0) {
        failed = failed + 1;
        pump();
        return;
      }
      var fileName = hash(item.image) + extensionFor(res.contentType, item.image);
      fs.writeFileSync(path.join(CACHE_DIR, fileName), res.body);
      item.image = PUBLIC_PREFIX + fileName;
      ok = ok + 1;
      pump();
    });
  }

  pump();
}

var items = loadItems();
var withImage = items.filter(function (i) { return !!i.image; }).length;
console.log('caching OG images for', withImage, 'items…');
cacheAll(items, function (summary) {
  console.log('OG images cached:', summary.ok, 'ok,',
    summary.failed, 'failed of', summary.attempted);
  writeItems(items);
});
