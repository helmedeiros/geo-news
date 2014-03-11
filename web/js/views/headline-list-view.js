/* global $, Backbone, _ */
'use strict';

(function () {
  var TEMPLATE = _.template(
    '<div class="headline">' +
      '<a href="<%= link %>" target="_blank"><%- title %></a>' +
      '<div class="meta">' +
        '<%- portalId %> · <%- publishedAt %>' +
      '</div>' +
    '</div>'
  );

  window.GeoNewsHeadlineListView = Backbone.View.extend({
    el: '#headlines',

    initialize: function (options) {
      this.headlines = options.headlines;
      this.listenTo(this.headlines, 'reset change', this.render);
      this.render();
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
      var html = items.map(function (i) {
        return TEMPLATE({
          link: i.link,
          title: i.title,
          portalId: i.portalId,
          publishedAt: new Date(i.publishedAt).toLocaleString()
        });
      }).join('');
      this.$el.html(html);
      return this;
    }
  });
}());
