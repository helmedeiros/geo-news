/* global Backbone, GeoNewsMapView, GeoNewsModeToggleView */
'use strict';

(function () {
  document.body.setAttribute('data-app', 'geo-news');

  var RegionQuery = Backbone.Model.extend({
    defaults: {
      mode: 'publisher',
      south: -60,
      west: -90,
      north: 15,
      east: -30
    }
  });

  var regionQuery = new RegionQuery();
  new GeoNewsMapView({ regionQuery: regionQuery });
  new GeoNewsModeToggleView({ regionQuery: regionQuery });
}());
