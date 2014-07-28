'use strict';

var expect = require('chai').expect;
var http = require('http');
var nodeHttpClient = require('../../lib/src/adapters/node-http-client');

describe('NodeHttpClient', function () {
  var server;
  var port;

  before(function (done) {
    server = http.createServer(function (req, res) {
      if (req.url === '/ok') {
        res.writeHead(200, { 'content-type': 'application/xml' });
        return res.end('<rss>hi</rss>');
      }
      if (req.url === '/redirect') {
        res.writeHead(302, { 'location': '/ok' });
        return res.end();
      }
      if (req.url === '/loop') {
        res.writeHead(302, { 'location': '/loop' });
        return res.end();
      }
      res.writeHead(404);
      res.end('nope');
    });
    server.listen(0, function () {
      port = server.address().port;
      done();
    });
  });

  after(function (done) { server.close(done); });

  it('returns the body for a 2xx response', function (done) {
    var client = nodeHttpClient.create();
    client.get('http://127.0.0.1:' + port + '/ok', function (err, body) {
      expect(err).to.equal(null);
      expect(body).to.equal('<rss>hi</rss>');
      done();
    });
  });

  it('reports a non-2xx response as an error', function (done) {
    var client = nodeHttpClient.create();
    client.get('http://127.0.0.1:' + port + '/missing', function (err) {
      expect(err.message).to.match(/HTTP 404/);
      done();
    });
  });

  it('follows a 302 redirect and returns the final body', function (done) {
    var client = nodeHttpClient.create();
    client.get('http://127.0.0.1:' + port + '/redirect', function (err, body) {
      expect(err).to.equal(null);
      expect(body).to.equal('<rss>hi</rss>');
      done();
    });
  });

  it('stops when the redirect chain exceeds maxRedirects', function (done) {
    var client = nodeHttpClient.create({ maxRedirects: 2 });
    client.get('http://127.0.0.1:' + port + '/loop', function (err) {
      expect(err.message).to.match(/too many redirects/);
      done();
    });
  });
});
