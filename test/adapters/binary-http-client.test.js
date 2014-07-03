'use strict';

var expect = require('chai').expect;
var http = require('http');
var binaryHttpClient = require('../../lib/src/adapters/binary-http-client');

var PNG = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  0x00, 0x00, 0x00, 0x0d
]);

describe('BinaryHttpClient', function () {
  var server;
  var port;

  before(function (done) {
    server = http.createServer(function (req, res) {
      if (req.url === '/png') {
        res.writeHead(200, { 'content-type': 'image/png' });
        return res.end(PNG);
      }
      if (req.url === '/redirect') {
        res.writeHead(302, { 'location': '/png' });
        return res.end();
      }
      if (req.url === '/big') {
        res.writeHead(200, { 'content-type': 'image/jpeg' });
        return res.end(Buffer.alloc(2000, 0));
      }
      res.writeHead(404);
      res.end();
    });
    server.listen(0, function () {
      port = server.address().port;
      done();
    });
  });

  after(function (done) { server.close(done); });

  it('returns body buffer and content-type on 2xx', function (done) {
    var client = binaryHttpClient.create();
    client.get('http://127.0.0.1:' + port + '/png', function (err, res) {
      expect(err).to.equal(null);
      expect(res.contentType).to.equal('image/png');
      expect(Buffer.isBuffer(res.body)).to.equal(true);
      expect(res.body.length).to.equal(PNG.length);
      done();
    });
  });

  it('follows redirects to the underlying asset', function (done) {
    var client = binaryHttpClient.create();
    client.get('http://127.0.0.1:' + port + '/redirect', function (err, res) {
      expect(err).to.equal(null);
      expect(res.contentType).to.equal('image/png');
      done();
    });
  });

  it('aborts when the asset exceeds maxBytes', function (done) {
    var client = binaryHttpClient.create({ maxBytes: 1000 });
    client.get('http://127.0.0.1:' + port + '/big', function (err) {
      expect(err.message).to.match(/exceeds 1000 bytes/);
      done();
    });
  });
});
