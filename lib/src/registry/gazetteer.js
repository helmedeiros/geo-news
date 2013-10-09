'use strict';

/**
 * gazetteer — in-process lookup over the bundled Americas city list. Names are
 * matched case-insensitively and accent-folded so that "Sao Paulo" and "São
 * Paulo" resolve to the same entry.
 */

var ENTRIES = require('./gazetteer.json');

function fold(text) {
  return (text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

var byFolded = (function () {
  var index = {};
  var i;
  for (i = 0; i < ENTRIES.length; i++) {
    index[fold(ENTRIES[i].name)] = ENTRIES[i];
  }
  return index;
})();

function find(name) {
  var hit = byFolded[fold(name)];
  return hit || null;
}

function all() {
  return ENTRIES.slice();
}

module.exports = {
  find: find,
  all: all,
  fold: fold
};
