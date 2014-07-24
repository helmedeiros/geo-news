'use strict';

var expect = require('chai').expect;
var exec = require('child_process').exec;
var path = require('path');

describe('examples/embed.js', function () {
  this.timeout(5000);

  it('runs end-to-end and prints both publisher and event sections', function (done) {
    var script = path.join(__dirname, '..', '..', 'examples', 'embed.js');
    exec('node "' + script + '"', function (err, stdout) {
      expect(err).to.equal(null);
      expect(stdout).to.contain('publisher SA:');
      expect(stdout).to.contain('event SA:');
      expect(stdout).to.contain('Vida en Buenos Aires');
      expect(stdout).to.contain('Buenos Aires in the spotlight');
      done();
    });
  });
});
