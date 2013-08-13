'use strict';

/**
 * Dedup — pure helper that collapses NewsItem-shaped records to one per id.
 * Later items win, which makes the helper idempotent under "re-index the
 * same feed" workflows that often refresh titles or summaries.
 */

function byId(items) {
  var seen = {};
  var i;
  for (i = 0; i < items.length; i++) {
    seen[items[i].id] = items[i];
  }
  var out = [];
  var k;
  for (k in seen) {
    if (seen.hasOwnProperty(k)) { out.push(seen[k]); }
  }
  return out;
}

module.exports = {
  byId: byId
};
