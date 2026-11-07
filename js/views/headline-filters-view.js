/* global $, Backbone, _ */

(function () {
  'use strict';

  var OPTION_TEMPLATE = _.template(
    '<option value="<%- value %>"<% if (selected) { %> selected<% } %>>' +
      '<%- label %>' +
    '</option>'
  );

  function buildOptions(items, selected) {
    return items.map(function (it) {
      return OPTION_TEMPLATE({
        value: it.value,
        label: it.label,
        selected: it.value === selected
      });
    }).join('');
  }

  window.GeoNewsHeadlineFiltersView = Backbone.View.extend({
    el: '#filters',

    events: {
      'input .filter-query': 'onQuery',
      'change .filter-sort': 'onSort',
      'change .filter-source': 'onSource',
      'change .filter-since': 'onSince'
    },

    initialize: function (options) {
      this.filters = options.filters;
      this.listenTo(this.filters, 'change:availableSources', this.renderSources);
      this.render();
    },

    render: function () {
      var sortOptions = [
        { value: 'newest', label: 'Newest first' },
        { value: 'oldest', label: 'Oldest first' },
        { value: 'source', label: 'Source A→Z' }
      ];
      var sinceOptions = [
        { value: 'hour',  label: 'Last hour' },
        { value: 'today', label: 'Last 24h' },
        { value: 'week',  label: 'Last week' },
        { value: 'month', label: 'Last month' },
        { value: 'all',   label: 'Anytime' }
      ];
      this.$el.html(
        '<input type="search" class="filter-query" placeholder="search…">' +
        '<select class="filter-since">' +
          buildOptions(sinceOptions, this.filters.get('since')) +
        '</select>' +
        '<select class="filter-sort">' +
          buildOptions(sortOptions, this.filters.get('sort')) +
        '</select>' +
        '<select class="filter-source">' +
          '<option value="">All sources</option>' +
        '</select>' +
        '<div class="filter-count" data-role="count"></div>'
      );
      this.renderSources();
      return this;
    },

    setCount: function (shown, total) {
      this.$('[data-role=count]').text(
        'Showing ' + shown + ' of ' + total
      );
    },

    renderSources: function () {
      var sources = this.filters.get('availableSources') || [];
      var selected = this.filters.get('source');
      var head = '<option value="">All sources (' + sources.length + ')</option>';
      var rest = buildOptions(
        sources.map(function (s) { return { value: s.id, label: s.label }; }),
        selected
      );
      this.$('.filter-source').html(head + rest);
    },

    onQuery: function (e) {
      this.filters.set('query', $(e.currentTarget).val());
    },

    onSort: function (e) {
      this.filters.set('sort', $(e.currentTarget).val());
    },

    onSource: function (e) {
      this.filters.set('source', $(e.currentTarget).val());
    },

    onSince: function (e) {
      this.filters.set('since', $(e.currentTarget).val());
    }
  });
}());
