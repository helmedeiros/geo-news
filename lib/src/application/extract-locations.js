'use strict';

/**
 * ExtractLocationsUseCase — runs the configured LocationExtractorPort over
 * stored NewsItems and writes the enriched copy back to the repository. Used
 * by IndexNewsUseCase but also exposed standalone so the registry can be
 * re-enriched later if the extractor changes.
 */

var newsItem = require('../domain/news-item');

function create(deps) {
  var repository = deps.repository;
  var extractor = deps.extractor;

  function execute(item, callback) {
    extractor.extract(item, function (err, locations) {
      if (err) { return callback(err); }
      var enriched = newsItem.withLocations(item, locations);
      repository.save(enriched, callback);
    });
  }

  function executeAll(callback) {
    repository.findAll(function (findErr, items) {
      if (findErr) { return callback(findErr); }
      var remaining = items.length;
      if (remaining === 0) { return callback(null, 0); }
      var failed = false;
      items.forEach(function (item) {
        execute(item, function (saveErr) {
          if (failed) { return; }
          if (saveErr) { failed = true; return callback(saveErr); }
          remaining = remaining - 1;
          if (remaining === 0) { callback(null, items.length); }
        });
      });
    });
  }

  return {
    execute: execute,
    executeAll: executeAll
  };
}

module.exports = {
  create: create
};
