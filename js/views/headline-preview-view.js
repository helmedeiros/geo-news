/* global $, Backbone, _ */

(function () {
  'use strict';

  var TEMPLATE = _.template(
    '<div class="preview-card">' +
      '<button class="preview-close" aria-label="Close">×</button>' +
      '<% if (image) { %>' +
        '<img class="preview-image" src="<%- image %>" alt="">' +
      '<% } %>' +
      '<div class="preview-body">' +
        '<div class="preview-meta">' +
          '<%- portalLabel %><% if (country) { %> · <%- country %><% } %>' +
          ' · <%- date %>' +
        '</div>' +
        '<h2 class="preview-title"><%- title %></h2>' +
        '<% if (summary) { %>' +
          '<p class="preview-summary"><%- summary %></p>' +
        '<% } %>' +
        '<a class="preview-cta" href="<%= link %>" target="_blank" rel="noopener">' +
          'Read on <%- portalLabel %> →' +
        '</a>' +
      '</div>' +
    '</div>'
  );

  function clampSummary(text) {
    if (!text) { return ''; }
    var clean = String(text).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (clean.length <= 280) { return clean; }
    return clean.slice(0, 277).replace(/\s+\S*$/, '') + '…';
  }

  function formatDate(value) {
    var d = new Date(value);
    if (isNaN(d.getTime())) { return ''; }
    return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
  }

  window.GeoNewsHeadlinePreviewView = Backbone.View.extend({
    el: '#preview',

    events: {
      'click .preview-close':    'close',
      'click .preview-backdrop': 'close'
    },

    initialize: function (options) {
      this.registry = options.registry || {};
      this.$el.html('');
      this.$el.hide();
    },

    setRegistry: function (registry) {
      this.registry = registry || {};
    },

    open: function (item) {
      var entry = this.registry[item.portalId];
      var html = '<div class="preview-backdrop"></div>' + TEMPLATE({
        title: item.title || '',
        link: item.link || '#',
        image: item.image || '',
        summary: clampSummary(item.preview || item.summary || ''),
        portalLabel: entry ? entry.name : item.portalId,
        country: entry ? entry.country : '',
        date: formatDate(item.publishedAt)
      });
      this.$el.html(html).show();
    },

    close: function () {
      this.$el.hide().html('');
    }
  });
}());
