'use strict';

/**
 * NewsFeedPort — driven port for fetching the latest items from a portal feed.
 *
 * Adapters implement:
 *
 *   fetch(portal, callback)
 *
 * with the contract:
 *   - `portal` is a Portal value object.
 *   - `callback(err, items)` follows Node convention; on success `items` is a
 *     plain array of NewsItem-shaped objects (callers freeze them).
 *   - Network, parsing and decoding errors are surfaced through `err` rather
 *     than thrown so use-cases stay synchronous and total.
 *
 * This module exports the contract documentation only. There is no class to
 * extend; any object exposing `fetch(portal, callback)` satisfies the port.
 */

module.exports = {
  /**
   * Shape check used by composition roots and by tests that wire fakes.
   * Returns true when `candidate` exposes the required `fetch` method.
   */
  isImplementation: function (candidate) {
    return !!(candidate && typeof candidate.fetch === 'function');
  }
};
