/* global L, Backbone */
'use strict';

(function () {
  var AMERICAS_CENTER = [10, -75];
  var AMERICAS_ZOOM = 3;

  window.GeoNewsMapView = Backbone.View.extend({
    el: '#map',

    initialize: function (options) {
      this.regionQuery = options.regionQuery;
      this.map = L.map(this.el).setView(AMERICAS_CENTER, AMERICAS_ZOOM);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 12
      }).addTo(this.map);
      this.markers = L.layerGroup().addTo(this.map);
      this.map.on('moveend', this.publishBounds.bind(this));
      this.publishBounds();
    },

    publishBounds: function () {
      var b = this.map.getBounds();
      this.regionQuery.set({
        south: b.getSouth(),
        west: b.getWest(),
        north: b.getNorth(),
        east: b.getEast()
      });
    },

    renderItems: function (items) {
      this.markers.clearLayers();
      items.forEach(function (item) {
        var p = item.markerPoint;
        if (!p) { return; }
        L.marker([p.lat, p.lon]).bindPopup(
          '<b>' + item.title + '</b><br><small>' + item.portalId + '</small>'
        ).addTo(this.markers);
      }, this);
    }
  });
}());
