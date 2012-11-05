'use strict';

/**
 * InMemoryRepository — in-process NewsRepositoryPort adapter.
 *
 * Used by tests, by the browser bundle, and as a sensible default for
 * embedders that want to bring their own persistence later. Items are stored
 * keyed by id; saving the same id twice replaces the existing record.
 */

function create() {
  var byId = {};

  function save(item, callback) {
    byId[item.id] = item;
    if (callback) { callback(null, item); }
  }

  function findById(id, callback) {
    var item = byId.hasOwnProperty(id) ? byId[id] : null;
    callback(null, item);
  }

  function findAll(callback) {
    var key;
    var out = [];
    for (key in byId) {
      if (byId.hasOwnProperty(key)) { out.push(byId[key]); }
    }
    callback(null, out);
  }

  function findByPortal(portalId, callback) {
    var key;
    var out = [];
    for (key in byId) {
      if (byId.hasOwnProperty(key) && byId[key].portalId === portalId) {
        out.push(byId[key]);
      }
    }
    callback(null, out);
  }

  return {
    save: save,
    findById: findById,
    findAll: findAll,
    findByPortal: findByPortal
  };
}

module.exports = {
  create: create
};
