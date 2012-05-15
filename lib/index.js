'use strict';

/**
 * geo-news public entry point.
 *
 * The composition root will live here once domain, ports and adapters are in
 * place. For now this module exposes only the package version so that early
 * consumers can sanity-check installation.
 */

module.exports.version = require('../package.json').version;
