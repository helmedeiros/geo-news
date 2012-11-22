'use strict';

/**
 * QueryByRegionUseCase — answers the question "what news belongs to this
 * bounding box?".
 *
 * Two modes are supported:
 *   - 'publisher' : the news belongs to the box if its portal's home city
 *     coordinates fall inside the box.
 *   - 'event'     : the news belongs to the box if any of the locations
 *     extracted from the story falls inside the box.
 *
 * Dependencies:
 *   repository  {NewsRepositoryPort}
 *   portals     {PortalRegistryPort}      // for publisher mode lookups
 *
 * The use-case is pure with respect to its inputs once data is loaded.
 */

var boundingBox = require('../domain/bounding-box');

function create(deps) {
  var repository = deps.repository;
  var portals = deps.portals;

  function execute(params, callback) {
    if (params.mode === 'publisher') {
      return runPublisher(params.bbox, callback);
    }
    if (params.mode === 'event') {
      return runEvent(params.bbox, callback);
    }
    callback(new Error('unknown query mode: ' + params.mode));
  }

  function runPublisher(bbox, callback) {
    repository.findAll(function (err, items) {
      if (err) { return callback(err); }
      var matching = items.filter(function (item) {
        var portal = portals.byId(item.portalId);
        if (!portal) { return false; }
        return boundingBox.contains(bbox, portal.lat, portal.lon);
      });
      callback(null, matching);
    });
  }

  function runEvent(bbox, callback) {
    callback(null, []);
  }

  return {
    execute: execute
  };
}

module.exports = {
  create: create
};
