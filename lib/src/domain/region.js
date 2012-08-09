'use strict';

/**
 * Region — a named geographic area, anchored by a bounding box.
 *
 * Required attributes:
 *   id    {string}        slug used as a stable identifier
 *   name  {string}        display name
 *   bbox  {BoundingBox}   geographic extent
 */

function create(attrs) {
  return Object.freeze({
    id: attrs.id,
    name: attrs.name,
    bbox: attrs.bbox
  });
}

function equals(a, b) {
  return a.id === b.id;
}

module.exports = {
  create: create,
  equals: equals
};
