/* global Backbone */

(function () {
  'use strict';

  window.GeoNewsHeadlineFilters = Backbone.Model.extend({
    defaults: {
      sort: 'newest',
      source: '',
      query: '',
      availableSources: []
    },

    apply: function (items, registry) {
      var sort = this.get('sort');
      var source = this.get('source');
      var query = (this.get('query') || '').trim().toLowerCase();

      var filtered = items.filter(function (i) {
        if (source && i.portalId !== source) { return false; }
        if (query) {
          var hay = ((i.title || '') + ' ' + (i.summary || '')).toLowerCase();
          if (hay.indexOf(query) === -1) { return false; }
        }
        return true;
      });

      filtered.sort(this.comparator(sort, registry));
      return filtered;
    },

    comparator: function (sort, registry) {
      if (sort === 'oldest') {
        return function (a, b) {
          return new Date(a.publishedAt).getTime() -
                 new Date(b.publishedAt).getTime();
        };
      }
      if (sort === 'source') {
        return function (a, b) {
          var la = (registry[a.portalId] && registry[a.portalId].name) || a.portalId;
          var lb = (registry[b.portalId] && registry[b.portalId].name) || b.portalId;
          return la.localeCompare(lb);
        };
      }
      return function (a, b) {
        return new Date(b.publishedAt).getTime() -
               new Date(a.publishedAt).getTime();
      };
    },

    setSources: function (items, registry) {
      var seen = {};
      var sources = [];
      items.forEach(function (i) {
        if (seen[i.portalId]) { return; }
        seen[i.portalId] = true;
        var entry = registry[i.portalId];
        sources.push({
          id: i.portalId,
          label: entry ? entry.name : i.portalId
        });
      });
      sources.sort(function (a, b) { return a.label.localeCompare(b.label); });
      this.set('availableSources', sources);
      if (this.get('source') && !seen[this.get('source')]) {
        this.set('source', '');
      }
    }
  });
}());
