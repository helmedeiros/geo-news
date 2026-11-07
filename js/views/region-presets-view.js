/* global Backbone, $ */

(function () {
  'use strict';

  var PRESETS = [
    { id: 'americas',     label: 'Americas',     bbox: [-60, -170, 75, -30] },
    { id: 'north',        label: 'N. America',   bbox: [15,  -170, 75, -50] },
    { id: 'south',        label: 'S. America',   bbox: [-60, -90,  15, -30] },
    { id: 'argentina',    label: 'Argentina',    bbox: [-55, -75, -21, -53] },
    { id: 'brazil',       label: 'Brazil',       bbox: [-34, -74,  5,  -34] }
  ];

  window.GeoNewsRegionPresetsView = Backbone.View.extend({
    el: '.app-header',

    initialize: function (options) {
      this.map = options.map;
      var html = PRESETS.map(function (p) {
        return '<button data-preset="' + p.id + '">' + p.label + '</button>';
      }).join('');
      this.$el.find('h1').after('<nav class="region-presets">' + html + '</nav>');
      this.$el.on('click', '.region-presets button', this.onClick.bind(this));
    },

    onClick: function (e) {
      var id = $(e.currentTarget).data('preset');
      var preset = PRESETS.filter(function (p) { return p.id === id; })[0];
      if (!preset) { return; }
      var b = preset.bbox;
      this.map.fitBounds([[b[0], b[1]], [b[2], b[3]]]);
    }
  });
}());
