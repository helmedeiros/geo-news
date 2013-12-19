'use strict';

/**
 * Registry re-export. Composition roots and tests reach for the curated data
 * through this single index.
 */

module.exports = {
  portals: require('./portal-registry-loader'),
  validator: require('./portal-registry-validator'),
  regions: require('./regions'),
  gazetteer: require('./gazetteer')
};
