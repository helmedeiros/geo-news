'use strict';

/**
 * ClockPort — driven port providing the current instant.
 *
 * Use-cases depend on this port instead of calling `new Date()` so tests can
 * pin time and so platforms with a non-system clock (CI snapshots, replays)
 * can override it cleanly.
 *
 * Adapters implement:
 *   now()  returns a Date
 */

function isImplementation(candidate) {
  return !!(candidate && typeof candidate.now === 'function');
}

module.exports = {
  isImplementation: isImplementation
};
