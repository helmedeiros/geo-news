/* global $, Backbone, GeoNewsMapView, GeoNewsModeToggleView,
          GeoNewsHeadlineListView, GeoNewsHeadlines, GeoNewsAppController,
          GeoNewsRegionPresetsView, GeoNewsUrlState */
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
  new GeoNewsRegionPresetsView({ map: mapView.map });
  GeoNewsUrlState.bind(regionQuery, mapView.map);

  function loadHeadlines() {
    var d = $.Deferred();
    $.getJSON('data/headlines.json')
      .done(function (data) { d.resolve([data]); })
      .fail(function () {
        $.getJSON('data/headlines.sample.json')
          .done(function (data) { d.resolve([data]); })
          .fail(d.reject);
      });
    return d.promise();
  }

  $.when(
    loadHeadlines(),
    $.getJSON('data/portals.sample.json')
  ).done(function (headlinesResult, portalsResult) {
    mapView.setRegistry(portalsResult[0]);
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
