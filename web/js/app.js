/* global $, Backbone, GeoNewsMapView, GeoNewsModeToggleView,
          GeoNewsHeadlineListView, GeoNewsHeadlines, GeoNewsAppController */
'use strict';

(function () {
  document.body.setAttribute('data-app', 'geo-news');

  var RegionQuery = Backbone.Model.extend({
    defaults: {
      mode: 'publisher',
      south: -60, west: -90, north: 15, east: -30
    }
  });

  var regionQuery = new RegionQuery();
  var headlines = new GeoNewsHeadlines();
  var mapView = new GeoNewsMapView({ regionQuery: regionQuery });
  new GeoNewsModeToggleView({ regionQuery: regionQuery });
  new GeoNewsHeadlineListView({ headlines: headlines });

  $.when(
    $.getJSON('data/headlines.sample.json'),
    $.getJSON('data/portals.sample.json')
  ).done(function (headlinesResult, portalsResult) {
    new GeoNewsAppController({
      regionQuery: regionQuery,
      headlines: headlines,
      dataset: headlinesResult[0],
      registry: portalsResult[0],
      mapView: mapView
    });
  }).fail(function () {
    $('#headlines').html(
      '<p class="empty">Could not load the bundled dataset.</p>'
    );
  });
}());
