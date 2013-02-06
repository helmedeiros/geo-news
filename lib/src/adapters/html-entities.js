'use strict';

/**
 * htmlEntities — minimal HTML entity decoder for the handful of named
 * entities that show up in feed titles and summaries. Numeric entities
 * (decimal and hex) are decoded generically.
 */

var NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: '\'',
  nbsp: ' ', ndash: '–', mdash: '—',
  lsquo: '‘', rsquo: '’',
  ldquo: '“', rdquo: '”',
  hellip: '…'
};

function decode(text) {
  if (typeof text !== 'string') { return text; }
  return text
    .replace(/&#x([0-9a-f]+);/gi, function (m, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    })
    .replace(/&#(\d+);/g, function (m, dec) {
      return String.fromCharCode(parseInt(dec, 10));
    })
    .replace(/&([a-z]+);/gi, function (m, name) {
      var key = name.toLowerCase();
      return NAMED.hasOwnProperty(key) ? NAMED[key] : m;
    });
}

module.exports = {
  decode: decode
};
