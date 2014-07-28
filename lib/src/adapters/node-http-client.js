'use strict';

/**
 * NodeHttpClient — minimal http/https GET client used by the RssAdapter.
 *
 * Surfaces a `get(url, callback)` taking `callback(err, body)`. The full body
 * is buffered into a UTF-8 string; feed sizes are small enough that streaming
 * is not worth the extra moving parts at this layer.
 *
 * 3xx responses with a Location header are followed up to a configurable
 * depth so that providers like Google News (which 302 to a region-suffixed
 * URL) work out of the box.
 */

var http = require('http');
var https = require('https');
var url = require('url');

var DEFAULT_TIMEOUT_MS = 10000;
var DEFAULT_MAX_REDIRECTS = 5;
var USER_AGENT = 'geo-news/0.0 (+https://github.com/helmedeiros/geo-news)';

function create(options) {
  var opts = options || {};
  var timeoutMs = opts.timeoutMs || DEFAULT_TIMEOUT_MS;
  var maxRedirects = opts.maxRedirects === undefined ?
    DEFAULT_MAX_REDIRECTS : opts.maxRedirects;

  function getWithRedirects(target, remaining, callback) {
    var parsed = url.parse(target);
    var transport = parsed.protocol === 'https:' ? https : http;
    var requestOpts = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.path,
      method: 'GET',
      headers: {
        'user-agent': USER_AGENT,
        'accept': 'application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.5'
      }
    };
    var req = transport.request(requestOpts, function (res) {
      var status = res.statusCode;
      if (status >= 300 && status < 400 && res.headers.location) {
        res.resume();
        if (remaining <= 0) {
          return callback(new Error('too many redirects from ' + target));
        }
        var next = url.resolve(target, res.headers.location);
        return getWithRedirects(next, remaining - 1, callback);
      }
      if (status < 200 || status >= 300) {
        res.resume();
        return callback(new Error('HTTP ' + status + ' from ' + target));
      }
      var chunks = [];
      res.setEncoding('utf8');
      res.on('data', function (c) { chunks.push(c); });
      res.on('end', function () { callback(null, chunks.join('')); });
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
