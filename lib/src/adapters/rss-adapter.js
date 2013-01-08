'use strict';

/**
 * RssAdapter — NewsFeedPort backed by HTTP + an injected RSS parser.
 *
 * Two side concerns are pushed out as injected dependencies so this module
 * stays pure orchestration:
 *   httpClient.get(url, callback)   callback(err, body)
 *   parser.parse(xmlText)           returns [{ id, title, link, summary,
 *                                              publishedAt }]
 *
 * A default httpClient and parser are wired in `lib/index.js`. Tests inject
 * fakes directly. The adapter turns parsed entries into NewsItem-shaped
 * objects, stamping each with the supplied portal id.
 */

function create(deps) {
  var httpClient = deps.httpClient;
  var parser = deps.parser;

  function fetch(portal, callback) {
    httpClient.get(portal.rss, function (err, body) {
      if (err) { return callback(err); }
      var entries;
      try {
        entries = parser.parse(body);
      } catch (parseErr) {
        return callback(parseErr);
      }
      var items = entries.map(function (entry) {
        return {
          id: entry.id || (portal.id + ':' + entry.link),
          title: entry.title,
          link: entry.link,
          summary: entry.summary || '',
          publishedAt: entry.publishedAt,
          portalId: portal.id
        };
      });
      callback(null, items);
    });
  }

  return {
    fetch: fetch
  };
}

module.exports = {
  create: create
};
