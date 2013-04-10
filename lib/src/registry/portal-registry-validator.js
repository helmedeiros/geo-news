'use strict';

/**
 * portalRegistryValidator — defends the rest of the system from a corrupt
 * portals.json. Catches the most common authoring mistakes (missing rss, bad
 * coordinates, duplicated ids, more than three portals per country) without
 * pretending to be a generic JSON-schema validator.
 */

var REQUIRED_FIELDS = ['id', 'name', 'city', 'lat', 'lon', 'rss'];

function validate(doc) {
  var errors = [];
  var seenIds = {};
  var country;
  var records;
  var record;
  var i;
  var f;

  for (country in doc) {
    if (!doc.hasOwnProperty(country)) { continue; }
    records = doc[country];
    if (!Array.isArray(records)) {
      errors.push(country + ': not an array');
      continue;
    }
    if (records.length > 3) {
      errors.push(country + ': more than three portals (' + records.length + ')');
    }
    for (i = 0; i < records.length; i++) {
      record = records[i];
      for (f = 0; f < REQUIRED_FIELDS.length; f++) {
        if (record[REQUIRED_FIELDS[f]] === undefined) {
          errors.push(country + '[' + i + ']: missing ' + REQUIRED_FIELDS[f]);
        }
      }
      if (typeof record.lat === 'number' && (record.lat < -90 || record.lat > 90)) {
        errors.push(country + '[' + i + ']: lat out of range');
      }
      if (typeof record.lon === 'number' && (record.lon < -180 || record.lon > 180)) {
        errors.push(country + '[' + i + ']: lon out of range');
      }
      if (record.id) {
        if (seenIds[record.id]) {
          errors.push(country + '[' + i + ']: duplicate id ' + record.id);
        }
        seenIds[record.id] = true;
      }
    }
  }
  return errors;
}

module.exports = {
  validate: validate
};
