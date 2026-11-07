/* global Backbone */
'use strict';

(function () {
  window.GeoNewsHeadlines = Backbone.Collection.extend({
    queryFor: function (allItems, attrs, registry) {
      var bbox = {
        south: attrs.south, west: attrs.west,
        north: attrs.north, east: attrs.east
      };
      var matches = (attrs.mode === 'event')
        ? this.matchEvent(allItems, bbox)
        : this.matchPublisher(allItems, bbox, registry);
      this.reset(matches);
      return matches;
    },

    matchPublisher: function (items, bbox, registry) {
      return items.filter(function (i) {
        var p = registry[i.portalId];
        return p && contains(bbox, p.lat, p.lon);
      }).map(function (i) {
        var p = registry[i.portalId];
        return mark(i, p.lat, p.lon);
      });
    },

    matchEvent: function (items, bbox) {
      return items.reduce(function (acc, i) {
        var locs = i.extractedLocations || [];
        for (var k = 0; k < locs.length; k++) {
          if (contains(bbox, locs[k].lat, locs[k].lon)) {
            acc.push(mark(i, locs[k].lat, locs[k].lon));
            return acc;
          }
        }
        return acc;
      }, []);
    }
  });

  function contains(b, lat, lon) {
    return lat >= b.south && lat <= b.north && lon >= b.west && lon <= b.east;
  }

  function mark(item, lat, lon) {
    var out = {};
    for (var k in item) { if (item.hasOwnProperty(k)) { out[k] = item[k]; } }
    out.markerPoint = { lat: lat, lon: lon };
    return out;
  }
}());
