'use strict';

var expect = require('chai').expect;
var rssParser = require('../../lib/src/adapters/rss-parser');

var SAMPLE = [
  '<?xml version="1.0"?>',
  '<rss version="2.0">',
  '  <channel>',
  '    <title>Sample</title>',
  '    <item>',
  '      <title>First headline</title>',
  '      <link>http://example.com/1</link>',
  '      <description>An intro</description>',
  '      <pubDate>Tue, 08 Jan 2013 09:00:00 GMT</pubDate>',
  '    </item>',
  '    <item>',
  '      <title>Second headline</title>',
  '      <link>http://example.com/2</link>',
  '      <description><![CDATA[Some <em>HTML</em>]]></description>',
  '      <pubDate>Tue, 08 Jan 2013 10:00:00 GMT</pubDate>',
  '    </item>',
  '  </channel>',
  '</rss>'
].join('\n');

describe('RssParser.parse', function () {
  it('returns one entry per <item>', function () {
    var entries = rssParser.parse(SAMPLE);
    expect(entries).to.have.length(2);
  });

  it('reads title, link, summary and pubDate', function () {
    var entry = rssParser.parse(SAMPLE)[0];
    expect(entry.title).to.equal('First headline');
    expect(entry.link).to.equal('http://example.com/1');
    expect(entry.summary).to.equal('An intro');
    expect(entry.publishedAt instanceof Date).to.equal(true);
  });

  it('strips CDATA from description', function () {
    var entry = rssParser.parse(SAMPLE)[1];
    expect(entry.summary).to.equal('Some <em>HTML</em>');
  });

  it('rejects non-string input', function () {
    expect(function () { rssParser.parse(null); }).to['throw'](TypeError);
  });
});
