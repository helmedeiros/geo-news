/* global $, Backbone */
'use strict';

(function () {
  window.GeoNewsModeToggleView = Backbone.View.extend({
    el: '.mode-toggle',

    events: {
      'click button': 'onClick'
    },

    initialize: function (options) {
      this.regionQuery = options.regionQuery;
    },

    onClick: function (e) {
      var mode = $(e.currentTarget).data('mode');
      this.$('button').removeClass('is-active');
      $(e.currentTarget).addClass('is-active');
      this.regionQuery.set('mode', mode);
    }
  });
}());
