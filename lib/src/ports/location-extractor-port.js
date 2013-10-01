'use strict';

/**
 * LocationExtractorPort — driven port that turns a NewsItem (title + summary)
 * into a list of geographic locations the story is about.
 *
 * Adapters implement:
 *   extract(item, callback)
 *
 *   callback(err, locations) where each location is
 *     { name: string, lat: number, lon: number, confidence: number 0..1 }
 *
 * The contract is asynchronous so adapters can fall back to remote geocoders
 * if local lookup fails.
 */

function isImplementation(candidate) {
  return !!(candidate && typeof candidate.extract === 'function');
}

module.exports = {
  isImplementation: isImplementation
};
