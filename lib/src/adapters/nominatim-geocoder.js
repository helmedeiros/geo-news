'use strict';

/**
 * NominatimGeocoder — GeocoderPort adapter backed by the public OpenStreetMap
 * Nominatim service. Politely throttled: never more than one in-flight
 * request, with a configurable minimum gap between consecutive calls.
 *
 * The HTTP client is injected so tests can drive the adapter without going
 * over the wire.
 */

var DEFAULT_BASE = 'http://nominatim.openstreetmap.org/search';
var DEFAULT_GAP_MS = 1100;

function create(deps) {
  var httpClient = deps.httpClient;
  var base = deps.baseUrl || DEFAULT_BASE;
  var minGapMs = deps.minGapMs || DEFAULT_GAP_MS;
  var lastCallAt = 0;

  function lookup(name, callback) {
    var now = Date.now();
    var wait = Math.max(0, lastCallAt + minGapMs - now);
    setTimeout(function () {
      lastCallAt = Date.now();
      var url = base + '?format=json&limit=1&q=' + encodeURIComponent(name);
      httpClient.get(url, function (err, body) {
        if (err) { return callback(err); }
        var parsed;
        try {
          parsed = JSON.parse(body);
        } catch (parseErr) {
          return callback(parseErr);
        }
        if (!Array.isArray(parsed) || parsed.length === 0) {
          return callback(null, null);
        }
        var top = parsed[0];
        callback(null, {
          name: name,
          lat: parseFloat(top.lat),
          lon: parseFloat(top.lon),
          confidence: top.importance || 0.5
        });
      });
    }, wait);
  }

  return {
    lookup: lookup
  };
}

module.exports = {
  create: create
};
