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

```
npm install geo-news
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

## Status

Pre-1.0. The library — domain, ports, RSS adapter, portal registry and
location extraction — is in. The map UI lands next.

## Acknowledgements

- Map tiles by [OpenStreetMap](https://www.openstreetmap.org) contributors,
  served via the OSM tile servers (please be polite).
- Map rendering by [Leaflet](https://leafletjs.com).
- City list derived from [GeoNames](https://www.geonames.org) (CC-BY 4.0).
- UI built with [Backbone.js](https://backbonejs.org),
  [Underscore](https://underscorejs.org) and [jQuery](https://jquery.com).

## License

MIT — see `LICENSE`.
