# geo-news

[![build status](https://api.travis-ci.org/helmedeiros/geo-news.svg?branch=master)](https://travis-ci.org/helmedeiros/geo-news)

Geolocalised news for the Americas. **[Live demo](https://helmedeiros.github.io/geo-news/)**.

`geo-news` is a JavaScript library that fetches, indexes and queries news from
the top portals across North and South America, with two location modes:

* **publisher** — group news by the portal's home city.
* **event** — group news by the place the story is about.

The library is framework-agnostic and embeddable in any Node.js or browser
application. A reference map UI is provided under `web/`.

## Install

`geo-news` is not yet on the npm registry. Clone it from GitHub:

```
git clone https://github.com/helmedeiros/geo-news.git
cd geo-news && npm install
```

## Usage

```js
var geoNews = require('geo-news');
var rssAdapter = geoNews.adapters.rssAdapter;
var rssParser = geoNews.adapters.rssParser;
var nodeHttp  = geoNews.adapters.nodeHttpClient;
var extractor = geoNews.adapters.gazetteerExtractor;
var gazetteer = geoNews.registry.gazetteer;

var wired = geoNews.wire({
  feed: rssAdapter.create({
    httpClient: nodeHttp.create({ timeoutMs: 8000 }),
    parser: rssParser
  }),
  extractor: extractor.create({ gazetteer: gazetteer }),
  concurrency: 4
});

wired.indexAll.execute(function (err, summary) {
  if (err) { throw err; }
  wired.queryByRegion.execute(
    { mode: 'event', bbox: wired.regions.SOUTH_AMERICA.bbox },
    function (qErr, items) {
      items.forEach(function (i) { console.log('[' + i.portalId + '] ' + i.title); });
    }
  );
});
```

## Bundled portals (v1, curated)

| Country | Portals |
|---|---|
| 🇺🇸 United States | NYT, Washington Post, LA Times |
| 🇨🇦 Canada | Globe and Mail, CBC News, National Post |
| 🇲🇽 Mexico | El Universal, Reforma, Milenio |
| 🇦🇷 Argentina | Clarín, La Nación, Página/12 |
| 🇧🇷 Brazil | Folha de S.Paulo, O Globo, Estadão |
| 🇨🇱 Chile | Emol, La Tercera, BioBioChile |
| 🇨🇴 Colombia | El Tiempo, El Espectador, Semana |

Embedders can override the registry by passing their own
`PortalRegistryPort` to `wire()`.

## Location modes

`queryByRegion.execute({ mode, bbox })` answers two distinct questions:

* `publisher` — items whose publishing portal sits inside the bounding box.
  Available immediately on any indexed item, no extraction required.
* `event` — items whose extracted locations sit inside the bounding box.
  Requires an `extractor` to be passed to `wire()`. The library bundles
  `gazetteerExtractor` (offline, Americas-cities) and `compositeExtractor`
  which chains it with a `GeocoderPort` fallback.

## Status & known limitations

This is a working demo, not a production-supported product. Things to know
before relying on it:

- **Google News dependency**: 16 of the 64 bundled "portals" are Google News
  country aggregator RSS feeds. Google's terms of service forbid automated
  programmatic access; they can revoke without warning and ~half the live
  dataset would evaporate. The remaining ~48 entries are individual outlets
  (Clarín, Folha, NYT, Le Monde, …) and some of those work directly.
- **OG thumbnails are hot-linked** to publisher CDNs by default. Several
  publishers serve `403` to off-origin image requests; expect a slowly
  growing percentage of broken thumbnails over time. Use
  `scripts/cache-og-images.js` (see below) to bake them into the deploy.
- **Click-to-preview** never re-renders article body text. It only shows
  publisher-supplied snippet metadata (RSS `<description>`, `og:description`,
  `og:image`) plus a "Read on {source} →" link back to the publisher. No
  iframe, no scraping.
- **Manual deploys**: the live demo is refreshed by running
  `npm run deploy:pages` from a workstation. A GitHub Actions cron (see
  `.github/workflows/deploy.yml`) re-runs the deploy every 6 hours and
  fails its own run if the deployed page renders zero headlines.
- **Publisher-mode markers for Google News** sit at country capitals, since
  there is no single physical address for "Google News (Argentina)". As the
  GN share of the data grows, the publisher view gets less spatially
  informative; switch to event mode for an honest map.
- **Bundled gazetteer is 32 cities** — event mode misses any place outside
  that list. Pass a richer gazetteer to `gazetteerExtractor.create({…})`
  if you need wider coverage.
- **Snippet-licensing regimes** (EU Article 15, Canada C-18, Brazil
  PL 2630) apply to large platforms. Below their thresholds this demo is
  fine; if you re-host it commercially, check your jurisdiction.

## Acknowledgements

- Map tiles by [OpenStreetMap](https://www.openstreetmap.org) contributors,
  served via the OSM tile servers (please be polite).
- Map rendering by [Leaflet](https://leafletjs.com).
- City list derived from [GeoNames](https://www.geonames.org) (CC-BY 4.0).
- UI built with [Backbone.js](https://backbonejs.org),
  [Underscore](https://underscorejs.org) and [jQuery](https://jquery.com).

## License

MIT — see `LICENSE`.
