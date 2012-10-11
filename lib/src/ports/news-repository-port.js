'use strict';

/**
 * NewsRepositoryPort — driven port for persisting and retrieving news items.
 *
 * Adapters implement:
 *
 *   save(item, callback)        callback(err, savedItem)
 *   findById(id, callback)      callback(err, itemOrNull)
 *   findAll(callback)           callback(err, items)
 *   findByPortal(portalId, cb)  cb(err, items)
 *
 * Implementations must be idempotent on save: saving the same id twice keeps a
 * single record. Deletion is intentionally not part of the v1 contract.
 */

var REQUIRED = ['save', 'findById', 'findAll', 'findByPortal'];

function isImplementation(candidate) {
  if (!candidate) { return false; }
  var i;
  for (i = 0; i < REQUIRED.length; i++) {
    if (typeof candidate[REQUIRED[i]] !== 'function') { return false; }
  }
  return true;
}

module.exports = {
  isImplementation: isImplementation
};
