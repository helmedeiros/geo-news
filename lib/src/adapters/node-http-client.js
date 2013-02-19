'use strict';

/**
 * NodeHttpClient — minimal http/https GET client used by the RssAdapter.
 *
 * Surfaces a `get(url, callback)` taking `callback(err, body)`. The full body
 * is buffered into a UTF-8 string; feed sizes are small enough that streaming
 * is not worth the extra moving parts at this layer.
 */

var http = require('http');
var https = require('https');
var url = require('url');

var DEFAULT_TIMEOUT_MS = 10000;
var USER_AGENT = 'geo-news/0.0 (+https://github.com/helmedeiros/geo-news)';

function create(options) {
  var opts = options || {};
  var timeoutMs = opts.timeoutMs || DEFAULT_TIMEOUT_MS;

  function get(target, callback) {
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
      if (res.statusCode < 200 || res.statusCode >= 300) {
        res.resume();
        return callback(new Error('HTTP ' + res.statusCode + ' from ' + target));
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
    get: get
  };
}

module.exports = {
  create: create
};
