'use strict';

/**
 * GazetteerExtractor — LocationExtractorPort adapter that scans the news item's
 * title and summary for capitalised proper nouns and resolves them against the
 * bundled gazetteer. Anything unresolved is dropped; remote geocoding is the
 * concern of a different adapter.
 */

var CANDIDATE_RE = /(?:[A-ZÁÉÍÓÚÂÊÔÃÕÑÇ][\wÁÉÍÓÚÂÊÔÃÕÑáéíóúâêôãõñç]+(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÑÇdel ][\wÁÉÍÓÚÂÊÔÃÕÑáéíóúâêôãõñç]+){0,3})/g;

function create(deps) {
  var gazetteer = deps.gazetteer;

  function extract(item, callback) {
    var text = ((item.title || '') + ' ' + (item.summary || '')).trim();
    var seen = {};
    var hits = [];
    var match;
    while ((match = CANDIDATE_RE.exec(text)) !== null) {
      var phrase = match[0];
      if (seen[phrase]) { continue; }
      seen[phrase] = true;
      var hit = gazetteer.find(phrase);
      if (hit) {
        hits.push({
          name: hit.name,
          lat: hit.lat,
          lon: hit.lon,
          confidence: 0.7
        });
      }
    }
    process.nextTick(function () { callback(null, hits); });
  }

  return {
    extract: extract
  };
}

module.exports = {
  create: create
};
