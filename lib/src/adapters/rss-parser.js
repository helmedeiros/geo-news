'use strict';

/**
 * RssParser — hand-rolled RSS 2.0 reader sufficient for the feeds the v1
 * registry pulls from. The parser is deliberately small: it accepts a full
 * XML document and returns a flat list of entries. Anything richer (CDATA
 * decoding, namespaces, Atom) is added in subsequent commits.
 */

var ITEM_RE = /<item\b[\s\S]*?<\/item>/gi;

function tagValue(itemXml, tag) {
  var re = new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>', 'i');
  var match = itemXml.match(re);
  if (!match) { return ''; }
  return match[1].replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim();
}

function parse(xml) {
  if (typeof xml !== 'string') {
    throw new TypeError('RssParser.parse expects a string');
  }
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

module.exports = {
  parse: parse
};
