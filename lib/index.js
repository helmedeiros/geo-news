'use strict';

/**
 * geo-news public entry point.
 *
 * Wires the default adapter set (in-memory repository + in-memory portal
 * registry + system clock) into the application use-cases and exposes both
 * raw building blocks (domain, ports, adapters) and a pre-wired façade.
 *
 * Consumers wanting to override any port pass their own implementation in the
 * options bag:
 *
 *   var geo = require('geo-news').wire({
 *     feed: myRssAdapter,
 *     repository: myRepository,
 *     portals: myPortalRegistry,
 *     clock: myClock
 *   });
 */

var domain = require('./src/domain');
var application = require('./src/application');
var registry = require('./src/registry');
var inMemoryRepository = require('./src/adapters/in-memory-repository');
var inMemoryPortalRegistry = require('./src/adapters/in-memory-portal-registry');
var systemClock = require('./src/adapters/system-clock');

function wire(options) {
  var opts = options || {};
  var repository = opts.repository || inMemoryRepository.create();
  var portals = opts.portals || inMemoryPortalRegistry.create(registry.portals.fromBundled());
  var clock = opts.clock || systemClock;
  return {
    repository: repository,
    portals: portals,
    clock: clock,
    regions: registry.regions,
    indexNews: application.indexNews.create({
      feed: opts.feed,
      repository: repository,
      clock: clock
    }),
    queryByRegion: application.queryByRegion.create({
      repository: repository,
      portals: portals
    })
  };
}

module.exports = {
  version: require('../package.json').version,
  domain: domain,
  application: application,
  registry: registry,
  adapters: {
    inMemoryRepository: inMemoryRepository,
    inMemoryPortalRegistry: inMemoryPortalRegistry,
    systemClock: systemClock
  },
  wire: wire
};
