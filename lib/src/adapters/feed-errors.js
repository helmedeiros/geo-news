'use strict';

/**
 * FeedErrors — small typed-error factory used by feed adapters so callers can
 * branch on `err.code` rather than parsing strings.
 *
 * Codes:
 *   E_HTTP        non-2xx response or transport failure
 *   E_PARSE       feed body could not be parsed as RSS or Atom
 *   E_TIMEOUT     request exceeded the configured timeout
 */

function feedError(code, message, cause) {
  var err = new Error(message);
  err.code = code;
  err.cause = cause || null;
  return err;
}

module.exports = {
  http: function (message, cause) { return feedError('E_HTTP', message, cause); },
  parse: function (message, cause) { return feedError('E_PARSE', message, cause); },
  timeout: function (message) { return feedError('E_TIMEOUT', message); }
};
