'use strict';

var expect = require('chai').expect;
var http = require('http');
var path = require('path');
var execFile = require('child_process').execFile;

var SCRIPT = path.join(__dirname, '..', '..', 'scripts', 'verify-live.sh');
var PAGE = '<html><body><div id="map"></div>' +
  '<ul><li class="headline">Story</li></ul>' +
  '<script src="js/app.js"></script></body></html>';

function startSite(buildFor) {
  var requests = { build: 0 };
  var server = http.createServer(function (req, res) {
    if (req.url.indexOf('/build.json') === 0) {
      requests.build += 1;
      var build = buildFor(requests.build);
      if (build === null) {
        res.writeHead(404);
        return res.end();
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ build: build }));
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(PAGE);
  });
  return { server: server, requests: requests };
}

function verify(site, expected, done) {
  site.server.listen(0, '127.0.0.1', function () {
    var url = 'http://127.0.0.1:' + site.server.address().port + '/';
    var args = expected ? [SCRIPT, url, expected] : [SCRIPT, url];
    var env = Object.assign({}, process.env, {
      VERIFY_MAX_TRIES: '3',
      VERIFY_SLEEP_S: '0'
    });
    execFile('bash', args, { env: env, timeout: 60000 }, function (err, stdout, stderr) {
      site.server.close();
      done(err ? err.code : 0, stdout + stderr);
    });
  });
}

describe('scripts/verify-live.sh', function () {
  this.timeout(90000);

  it('passes when the live build matches the expected build', function (done) {
    verify(startSite(function () { return 'run-2'; }), 'run-2', function (code, out) {
      expect(code, out).to.equal(0);
      done();
    });
  });

  it('fails when the previous build is still being served', function (done) {
    verify(startSite(function () { return 'run-1'; }), 'run-2', function (code, out) {
      expect(code, out).to.equal(1);
      expect(out).to.contain('run-2');
      done();
    });
  });

  it('fails when the live site has no build stamp', function (done) {
    verify(startSite(function () { return null; }), 'run-2', function (code, out) {
      expect(code, out).to.equal(1);
      done();
    });
  });

  it('retries until the new build goes live', function (done) {
    var site = startSite(function (n) { return n < 3 ? 'run-1' : 'run-2'; });
    verify(site, 'run-2', function (code, out) {
      expect(code, out).to.equal(0);
      expect(site.requests.build).to.equal(3);
      done();
    });
  });

  it('still only checks rendering when no build is expected', function (done) {
    verify(startSite(function () { return null; }), null, function (code, out) {
      expect(code, out).to.equal(0);
      done();
    });
  });
});
