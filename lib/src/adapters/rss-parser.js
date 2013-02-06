'use strict';

/**
 * RssParser — hand-rolled RSS 2.0 reader sufficient for the feeds the v1
 * registry pulls from. The parser is deliberately small: it accepts a full
 * XML document and returns a flat list of entries. Anything richer (CDATA
 * decoding, namespaces, Atom) is added in subsequent commits.
 */

var htmlEntities = require('./html-entities');

var ITEM_RE = /<item\b[\s\S]*?<\/item>/gi;
var ENTRY_RE = /<entry\b[\s\S]*?<\/entry>/gi;
var ATOM_LINK_RE = /<link\b[^>]*href=["']([^"']+)["'][^>]*\/?>/i;

function tagValue(itemXml, tag) {
  var re = new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>', 'i');
  var match = itemXml.match(re);
  if (!match) { return ''; }
  var raw = match[1].replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim();
  return htmlEntities.decode(raw);
}

function parseRss(xml) {
  var matches = xml.match(ITEM_RE) || [];
  return matches.map(function (block) {
    var date = tagValue(block, 'pubDate');
    return {
      title: tagValue(block, 'title'),
      link: tagValue(block, 'link'),
      summary: tagValue(block, 'description'),
      publishedAt: date ? new Date(date) : null
    };
  });
}

function parseAtom(xml) {
  var matches = xml.match(ENTRY_RE) || [];
  return matches.map(function (block) {
    var linkMatch = block.match(ATOM_LINK_RE);
    var date = tagValue(block, 'updated') || tagValue(block, 'published');
    return {
      title: tagValue(block, 'title'),
      link: linkMatch ? linkMatch[1] : '',
      summary: tagValue(block, 'summary') || tagValue(block, 'content'),
      publishedAt: date ? new Date(date) : null
    };
  });
}

function parse(xml) {
  if (typeof xml !== 'string') {
    throw new TypeError('RssParser.parse expects a string');
  }
  if (xml.indexOf('<feed') !== -1) {
    return parseAtom(xml);
  }
  return parseRss(xml);
}

module.exports = {
  parse: parse
};
