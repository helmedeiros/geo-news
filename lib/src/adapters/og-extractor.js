'use strict';

/**
 * OgExtractor — fetches an article URL and pulls OpenGraph + standard `<head>`
 * metadata. Used at build time to bake a thumbnail and lead paragraph into
 * each NewsItem so the UI can show a click-to-preview panel without ever
 * re-rendering the publisher's article body.
 *
 * Only the `<head>` section is parsed; everything after `</head>` is dropped
 * to keep the regex pass cheap and to stay within fair-use snippet territory.
 */

var META_PROP_FIRST = /<meta\b[^>]*?(?:property|name)\s*=\s*["']([^"']+)["'][^>]*?content\s*=\s*["']([^"']*)["'][^>]*>/gi;
var META_CONTENT_FIRST = /<meta\b[^>]*?content\s*=\s*["']([^"']*)["'][^>]*?(?:property|name)\s*=\s*["']([^"']+)["'][^>]*>/gi;

function parse(html) {
  if (typeof html !== 'string') {
    throw new TypeError('OgExtractor.parse expects a string');
  }
  var headEnd = html.toLowerCase().indexOf('</head>');
  var head = headEnd === -1 ? html.substring(0, 16000) : html.substring(0, headEnd);
  var meta = {};
  var m;
  while ((m = META_PROP_FIRST.exec(head)) !== null) {
    meta[m[1].toLowerCase()] = m[2];
  }
  while ((m = META_CONTENT_FIRST.exec(head)) !== null) {
    var key = m[2].toLowerCase();
    if (!meta[key]) { meta[key] = m[1]; }
  }
  return {
    title: meta['og:title'] || '',
    description: meta['og:description'] || meta['twitter:description'] || meta.description || '',
    image: meta['og:image'] || meta['twitter:image'] || ''
  };
}

function create(deps) {
  var httpClient = deps.httpClient;

  function extract(url, callback) {
    httpClient.get(url, function (err, body) {
      if (err) { return callback(err); }
      try {
        callback(null, parse(body));
      } catch (parseErr) {
        callback(parseErr);
      }
    });
  }

  return {
    extract: extract
  };
}

module.exports = {
  parse: parse,
  create: create
};
