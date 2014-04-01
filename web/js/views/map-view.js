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
      var mode = this.regionQuery.get('mode');
      var color = mode === 'event' ? '#c0392b' : '#2c7be5';
      items.forEach(function (item) {
        var p = item.markerPoint;
        if (!p) { return; }
        L.circleMarker([p.lat, p.lon], {
          radius: 7, color: color, weight: 2, fillOpacity: 0.6
        }).bindPopup(
          '<b>' + item.title + '</b><br><small>' + item.portalId + '</small>'
        ).addTo(this.markers);
      }, this);
    }
  });
}());
