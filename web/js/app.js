/* global $, Backbone, GeoNewsMapView, GeoNewsModeToggleView,
          GeoNewsHeadlineListView, GeoNewsHeadlines, GeoNewsAppController,
          GeoNewsRegionPresetsView, GeoNewsUrlState,
          GeoNewsHeadlineFilters, GeoNewsHeadlineFiltersView */
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
  var filters = new GeoNewsHeadlineFilters();
  var headlines = new GeoNewsHeadlines();
  var mapView = new GeoNewsMapView({ regionQuery: regionQuery });
  new GeoNewsModeToggleView({ regionQuery: regionQuery });
  var headlineListView = new GeoNewsHeadlineListView({
    headlines: headlines,
    mapView: mapView
  });
  var filtersView = new GeoNewsHeadlineFiltersView({ filters: filters });
  new GeoNewsRegionPresetsView({ map: mapView.map });
  GeoNewsUrlState.bind(regionQuery, mapView.map);

  function loadHeadlines() {
    var d = $.Deferred();
    var sample = $.getJSON('data/headlines.sample.json');
    var live = $.getJSON('data/headlines.json');
    $.when(sample.then(null, function () { return [[]]; }),
           live.then(null, function () { return [[]]; }))
      .done(function (sampleArgs, liveArgs) {
        var sampleData = $.isArray(sampleArgs) ? sampleArgs[0] : sampleArgs;
        var liveData = $.isArray(liveArgs) ? liveArgs[0] : liveArgs;
        var byId = {};
        (sampleData || []).forEach(function (i) { byId[i.id] = i; });
        (liveData || []).forEach(function (i) { byId[i.id] = i; });
        var merged = [];
        for (var k in byId) {
          if (byId.hasOwnProperty(k)) { merged.push(byId[k]); }
        }
        d.resolve([merged]);
      })
      .fail(function () { d.resolve([[]]); });
    return d.promise();
  }

  $.when(
    loadHeadlines(),
    $.getJSON('data/portals.sample.json')
  ).done(function (headlinesResult, portalsResult) {
    mapView.setRegistry(portalsResult[0]);
    headlineListView.setRegistry(portalsResult[0]);
    new GeoNewsAppController({
      regionQuery: regionQuery,
      filters: filters,
      filtersView: filtersView,
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
