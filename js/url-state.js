/* global Backbone */

(function () {
  'use strict';

  function read() {
    var hash = window.location.hash.replace(/^#/, '');
    var out = {};
    hash.split('&').forEach(function (pair) {
      var kv = pair.split('=');
      if (kv.length === 2 && kv[1] !== '') { out[kv[0]] = kv[1]; }
    });
    return out;
  }

  function write(attrs) {
    var parts = [];
    var k;
    for (k in attrs) {
      if (attrs.hasOwnProperty(k) && attrs[k] !== undefined && attrs[k] !== null) {
        parts.push(k + '=' + attrs[k]);
      }
    }
    window.location.hash = parts.join('&');
  }

  window.GeoNewsUrlState = {
    bind: function (regionQuery, map) {
      var initial = read();
      if (initial.mode) { regionQuery.set('mode', initial.mode); }
      if (initial.bbox) {
        var nums = initial.bbox.split(',').map(parseFloat);
        if (nums.length === 4 && nums.every(isFinite)) {
          map.fitBounds([[nums[0], nums[1]], [nums[2], nums[3]]]);
        }
      }
      regionQuery.on('change', function () {
        write({
          mode: regionQuery.get('mode'),
          bbox: [
            regionQuery.get('south'),
            regionQuery.get('west'),
            regionQuery.get('north'),
            regionQuery.get('east')
          ].map(function (n) { return n.toFixed(3); }).join(',')
        });
      });
    }
  };

  // Keep the linter happy about the Backbone dependency above.
  void Backbone;
}());
