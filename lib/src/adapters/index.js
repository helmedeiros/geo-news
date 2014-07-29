'use strict';

/**
 * Adapters re-export. Embedders that want to construct adapters by name reach
 * for them through this single index.
 */

module.exports = {
  inMemoryRepository: require('./in-memory-repository'),
  inMemoryPortalRegistry: require('./in-memory-portal-registry'),
  systemClock: require('./system-clock'),
  rssAdapter: require('./rss-adapter'),
  rssParser: require('./rss-parser'),
  nodeHttpClient: require('./node-http-client'),
  htmlEntities: require('./html-entities'),
  feedErrors: require('./feed-errors'),
  gazetteerExtractor: require('./gazetteer-extractor'),
  nominatimGeocoder: require('./nominatim-geocoder'),
  compositeExtractor: require('./composite-extractor'),
  ogExtractor: require('./og-extractor')
};
