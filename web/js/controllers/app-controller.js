/* global Backbone */
'use strict';

(function () {
  window.GeoNewsAppController = Backbone.Model.extend({
    initialize: function (options) {
      this.regionQuery = options.regionQuery;
      this.filters = options.filters;
      this.headlines = options.headlines;
      this.dataset = options.dataset;
      this.registry = options.registry;
      this.mapView = options.mapView;
      this.listenTo(this.regionQuery, 'change', this.run);
      if (this.filters) {
        this.listenTo(this.filters, 'change:sort change:source change:query',
                      this.run);
      }
      this.run();
    },

    run: function () {
      var matches = this.headlines.queryFor(
        this.dataset, this.regionQuery.attributes, this.registry
      );
      if (this.filters) {
        this.filters.setSources(matches, this.registry);
        matches = this.filters.apply(matches, this.registry);
      } else {
        matches.sort(function (a, b) {
          return new Date(b.publishedAt).getTime() -
                 new Date(a.publishedAt).getTime();
        });
      }
      this.headlines.reset(matches);
      this.mapView.renderItems(matches);
    }
  });
}());
