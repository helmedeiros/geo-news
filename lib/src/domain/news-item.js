'use strict';

/**
 * NewsItem — immutable value object describing a single news article.
 *
 * Domain modules expose pure functions over plain frozen objects. There is no
 * inheritance, no `this`, and no I/O at this layer.
 *
 * Required attributes:
 *   id           {string}  stable canonical identifier
 *   title        {string}  human readable headline
 *   link         {string}  permalink to the article
 *   publishedAt  {Date}    moment the article was published
 *   portalId     {string}  id of the publishing portal
 * Optional:
 *   summary      {string}  defaults to ''
 */

function create(attrs) {
  return Object.freeze({
    id: attrs.id,
    title: attrs.title,
    link: attrs.link,
    summary: attrs.summary || '',
    publishedAt: attrs.publishedAt,
    portalId: attrs.portalId,
    extractedLocations: Object.freeze((attrs.extractedLocations || []).slice())
  });
}

function withLocations(item, locations) {
  return create({
    id: item.id,
    title: item.title,
    link: item.link,
    summary: item.summary,
    publishedAt: item.publishedAt,
    portalId: item.portalId,
    extractedLocations: locations
  });
}

function equals(a, b) {
  return a.id === b.id;
}

function byPublishedAtDesc(a, b) {
  return b.publishedAt.getTime() - a.publishedAt.getTime();
}

module.exports = {
  create: create,
  withLocations: withLocations,
  equals: equals,
  byPublishedAtDesc: byPublishedAtDesc
};
