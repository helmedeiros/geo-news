'use strict';

var expect = require('chai').expect;
var clockPort = require('../../lib/src/ports/clock-port');
var systemClock = require('../../lib/src/adapters/system-clock');

describe('ClockPort', function () {
  it('accepts any object exposing a now function', function () {
    expect(clockPort.isImplementation({ now: function () {} })).to.equal(true);
    expect(clockPort.isImplementation({})).to.equal(false);
  });

  it('is implemented by the system-clock adapter', function () {
    expect(clockPort.isImplementation(systemClock)).to.equal(true);
    expect(systemClock.now() instanceof Date).to.equal(true);
  });
});
