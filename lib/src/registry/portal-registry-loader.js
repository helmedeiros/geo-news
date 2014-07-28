'use strict';

/**
 * portalRegistryLoader — turns a `portals.json` document into a flat list of
 * Portal value objects. The JSON is keyed by ISO country code and holds an
 * array of portal records per country.
 */

var portal = require('../domain/portal');

function toPortal(country, record) {
  return portal.create({
    id: record.id,
    name: record.name,
    country: country,
    city: record.city,
    lat: record.lat,
    lon: record.lon,
    rss: record.rss
  });
}

function fromDocument(doc) {
  var country;
  var portals = [];
  var records;
  var i;
  for (country in doc) {
    if (!doc.hasOwnProperty(country)) { continue; }
    records = doc[country];
    for (i = 0; i < records.length; i++) {
      portals.push(toPortal(country, records[i]));
    }
  }
  return portals;
}

function fromBundled() {
  var outlets = fromDocument(require('./portals.json'));
  var aggregators = fromDocument(require('./google-news-portals.json'));
  return outlets.concat(aggregators);
}

module.exports = {
  fromDocument: fromDocument,
  fromBundled: fromBundled
};
