'use strict';

/**
 * IndexAllUseCase — fans IndexNewsUseCase out across every portal in the
 * registry. Concurrency is capped to keep polite traffic patterns toward the
 * public RSS endpoints; per-portal failures are collected and returned so a
 * single bad feed does not poison the batch.
 *
 * Dependencies:
 *   portals      {PortalRegistryPort}
 *   indexNews    {IndexNewsUseCase}   // already wired with feed + repository
 *   concurrency  {number}             // optional, default 4
 *
 * Result shape:
 *   { savedCount, failures: [{ portalId, error }] }
 */

var DEFAULT_CONCURRENCY = 4;

function create(deps) {
  var portals = deps.portals;
  var indexNews = deps.indexNews;
  var concurrency = deps.concurrency || DEFAULT_CONCURRENCY;

  function execute(callback) {
    var queue = portals.all();
    var failures = [];
    var savedCount = 0;
    var inFlight = 0;
    var finished = false;

    function pump() {
      if (finished) { return; }
      if (queue.length === 0 && inFlight === 0) {
        finished = true;
        return callback(null, { savedCount: savedCount, failures: failures });
      }
      while (inFlight < concurrency && queue.length > 0) {
        runOne(queue.shift());
      }
    }

    function runOne(portal) {
      inFlight = inFlight + 1;
      indexNews.execute(portal, function (err, count) {
        inFlight = inFlight - 1;
        if (err) {
          failures.push({ portalId: portal.id, error: err });
        } else {
          savedCount = savedCount + count;
        }
        pump();
      });
    }

    pump();
  }

  return {
    execute: execute
  };
}

module.exports = {
  create: create
};
