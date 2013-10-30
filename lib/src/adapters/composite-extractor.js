'use strict';

/**
 * CompositeExtractor — chains a primary LocationExtractorPort with a
 * GeocoderPort fallback. The primary is expected to be cheap and offline
 * (the gazetteer); the geocoder is reached only for candidate names the
 * gazetteer could not resolve.
 *
 * Candidate names for the fallback are mined the same way the gazetteer
 * extractor mines them, so they are not re-tokenised here.
 */

var CANDIDATE_RE = /[A-ZÁÉÍÓÚÂÊÔÃÕÑÇ][^\s,.;:!?]+/g;

function create(deps) {
  var primary = deps.primary;
  var geocoder = deps.geocoder;

  function extract(item, callback) {
    primary.extract(item, function (err, primaryHits) {
      if (err) { return callback(err); }
      if (!geocoder) { return callback(null, primaryHits); }
      var known = {};
      primaryHits.forEach(function (h) { known[h.name] = true; });
      var text = (item.title || '') + ' ' + (item.summary || '');
      var candidates = (text.match(CANDIDATE_RE) || []).filter(function (c) {
        return !known[c];
      });
      resolveSequentially(candidates, function (extra) {
        callback(null, primaryHits.concat(extra));
      });
    });

    function resolveSequentially(names, done) {
      var hits = [];
      var i = 0;
      function next() {
        if (i >= names.length) { return done(hits); }
        var name = names[i++];
        geocoder.lookup(name, function (lookupErr, hit) {
          if (!lookupErr && hit) { hits.push(hit); }
          next();
        });
      }
      next();
    }
  }

  return {
    extract: extract
  };
}

module.exports = {
  create: create
};
