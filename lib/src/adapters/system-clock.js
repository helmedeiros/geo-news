'use strict';

/**
 * SystemClock — default ClockPort adapter backed by `Date`.
 */

module.exports = {
  now: function () {
    return new Date();
  }
};
