'use strict';

/**
 * BinaryHttpClient — `get(url, callback)` returning a Node Buffer plus the
 * resolved content-type, used for caching OpenGraph thumbnails. Mirrors
 * NodeHttpClient's redirect-following behaviour so providers that 302
 * (Google News, image CDNs) still deliver the underlying asset.
 */

var http = require('http');
var https = require('https');

var DEFAULT_TIMEOUT_MS = 8000;
var DEFAULT_MAX_REDIRECTS = 5;
var DEFAULT_MAX_BYTES = 2 * 1024 * 1024;
var USER_AGENT = 'geo-news/0.0 (+https://github.com/helmedeiros/geo-news)';

function create(options) {
  var opts = options || {};
  var timeoutMs = opts.timeoutMs || DEFAULT_TIMEOUT_MS;
  var maxRedirects = opts.maxRedirects === undefined ?
    DEFAULT_MAX_REDIRECTS : opts.maxRedirects;
  var maxBytes = opts.maxBytes || DEFAULT_MAX_BYTES;

  function getWithRedirects(target, remaining, callback) {
    var parsed = new URL(target);
    var transport = parsed.protocol === 'https:' ? https : http;
    var requestOpts = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: {
        'user-agent': USER_AGENT,
        'accept': 'image/*,*/*;q=0.8'
      }
    };
    var req = transport.request(requestOpts, function (res) {
      var status = res.statusCode;
      if (status >= 300 && status < 400 && res.headers.location) {
        res.resume();
        if (remaining <= 0) {
          return callback(new Error('too many redirects from ' + target));
        }
        var next = new URL(res.headers.location, target).toString();
        return getWithRedirects(next, remaining - 1, callback);
      }
      if (status < 200 || status >= 300) {
        res.resume();
        return callback(new Error('HTTP ' + status + ' from ' + target));
      }
      var chunks = [];
      var total = 0;
      var aborted = false;
      res.on('data', function (chunk) {
        if (aborted) { return; }
        total = total + chunk.length;
        if (total > maxBytes) {
          aborted = true;
          res.destroy();
          return callback(new Error('asset exceeds ' + maxBytes + ' bytes'));
        }
        chunks.push(chunk);
      });
      res.on('end', function () {
        if (aborted) { return; }
        callback(null, {
          body: Buffer.concat(chunks),
          contentType: (res.headers['content-type'] || '').split(';')[0].trim()
        });
      });
    });
    req.setTimeout(timeoutMs, function () {
      req.abort();
      callback(new Error('timed out fetching ' + target));
    });
    req.on('error', function (err) { callback(err); });
    req.end();
  }

  return {
    get: function (target, callback) {
      getWithRedirects(target, maxRedirects, callback);
    }
  };
}

module.exports = {
  create: create
};
