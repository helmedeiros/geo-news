/* global Backbone */
'use strict';

(function () {
  window.GeoNewsAppController = Backbone.Model.extend({
    initialize: function (options) {
      this.regionQuery = options.regionQuery;
      this.headlines = options.headlines;
      this.dataset = options.dataset;
      this.registry = options.registry;
      this.mapView = options.mapView;
      this.listenTo(this.regionQuery, 'change', this.run);
      this.run();
    },

    run: function () {
      var matches = this.headlines.queryFor(
        this.dataset, this.regionQuery.attributes, this.registry
      );
      this.mapView.renderItems(matches);
    }
  });
}());
