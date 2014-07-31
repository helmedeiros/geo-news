/* global $, Backbone, _ */
'use strict';

(function () {
  function formatDate(value) {
    var d = new Date(value);
    return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
  }

  var TEMPLATE = _.template(
    '<div class="headline" data-index="<%- index %>" ' +
         'data-lat="<%- lat %>" data-lon="<%- lon %>">' +
      '<a href="<%= link %>" target="_blank"><%- title %></a>' +
      '<div class="meta">' +
        '<%- portalLabel %> · <%- publishedAt %>' +
      '</div>' +
    '</div>'
  );

  window.GeoNewsHeadlineListView = Backbone.View.extend({
    el: '#headlines',

    events: {
      'click .headline': 'onClick'
    },

    initialize: function (options) {
      this.headlines = options.headlines;
      this.mapView = options.mapView;
      this.registry = options.registry || {};
      this.listenTo(this.headlines, 'reset change', this.render);
      this.render();
    },

    setRegistry: function (registry) {
      this.registry = registry || {};
    },

    render: function () {
      var items = this.headlines.toJSON();
      if (items.length === 0) {
        this.$el.html(
          '<p class="empty">No headlines in the current view. Try panning the ' +
          'map or switching mode.</p>'
        );
        return this;
      }
      var registry = this.registry;
      var html = items.map(function (i, index) {
        var p = i.markerPoint || { lat: '', lon: '' };
        var portalEntry = registry[i.portalId];
        return TEMPLATE({
          index: index,
          lat: p.lat,
          lon: p.lon,
          link: i.link,
          title: i.title,
          portalLabel: portalEntry ? portalEntry.name : i.portalId,
          publishedAt: formatDate(i.publishedAt)
        });
      }).join('');
      this.$el.html(html);
      return this;
    },

    onClick: function (e) {
      if (!this.mapView) { return; }
      if ($(e.target).is('a')) { return; }
      var $row = $(e.currentTarget);
      var lat = parseFloat($row.attr('data-lat'));
      var lon = parseFloat($row.attr('data-lon'));
      if (isFinite(lat) && isFinite(lon)) {
        this.mapView.focus(lat, lon);
      }
    }
  });
}());
