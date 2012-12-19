'use strict';

/**
 * Application layer re-export. Use-case factories are exposed through this
 * single index so consumers wire them by name without depending on internal
 * file paths.
 */

module.exports = {
  indexNews: require('./index-news'),
  queryByRegion: require('./query-by-region')
};
