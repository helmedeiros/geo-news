'use strict';

/**
 * Domain re-export. Consumers and inner layers depend on this single entry
 * point so adding or renaming a value object only touches one wiring file.
 */

module.exports = {
  newsItem: require('./news-item'),
  portal: require('./portal'),
  coordinate: require('./coordinate'),
  boundingBox: require('./bounding-box'),
  region: require('./region'),
  country: require('./country')
};
