'use strict';

/**
 * IndexNewsUseCase — fetches the latest items from one portal feed and stores
 * them in the configured repository.
 *
 * Dependencies are injected at construction:
 *   feed         {NewsFeedPort}
 *   repository   {NewsRepositoryPort}
 *   clock        {ClockPort}              (reserved for cut-off filtering)
 *
 * Errors from the feed adapter are passed to the caller unchanged. Items that
 * already exist in the repository are saved again — the repository is
 * responsible for idempotency.
 */

function create(deps) {
  var feed = deps.feed;
  var repository = deps.repository;

  function execute(portal, callback) {
    feed.fetch(portal, function (err, items) {
      if (err) { return callback(err); }
      saveAll(items, callback);
    });
  }

  function saveAll(items, callback) {
    var remaining = items.length;
    var failed = false;
    if (remaining === 0) { return callback(null, 0); }
    items.forEach(function (item) {
      repository.save(item, function (saveErr) {
        if (failed) { return; }
        if (saveErr) { failed = true; return callback(saveErr); }
        remaining = remaining - 1;
        if (remaining === 0) { callback(null, items.length); }
      });
    });
  }

  return {
    execute: execute
  };
}

module.exports = {
  create: create
};
