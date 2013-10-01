'use strict';

/**
 * Ports re-export. Composition roots and tests reach for ports through this
 * single index so that splitting or renaming a contract only touches one
 * wiring file.
 */

module.exports = {
  newsFeed: require('./news-feed-port'),
  newsRepository: require('./news-repository-port'),
  portalRegistry: require('./portal-registry-port'),
  clock: require('./clock-port'),
  locationExtractor: require('./location-extractor-port')
};
