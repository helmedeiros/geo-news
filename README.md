# geo-news

[![build status](https://api.travis-ci.org/helmedeiros/geo-news.svg?branch=master)](https://travis-ci.org/helmedeiros/geo-news)

Geolocalised news for the Americas. **[Live demo](https://helmedeiros.github.io/geo-news/)**.

`geo-news` is a JavaScript library that fetches, indexes and queries news from
the top portals across North and South America, with two location modes:

* **publisher** — group news by the portal's home city.
* **event** — group news by the place the story is about.

The library is framework-agnostic and embeddable in any Node.js or browser
application. A reference map UI is provided under `web/`.

## Usage

```js
var geo = require('geo-news').wire({
  feed: myRssAdapter,
  portals: myPortalRegistry
});

geo.indexNews.execute(somePortal, function (err) {
  if (err) { throw err; }
  geo.queryByRegion.execute(
    { mode: 'publisher', bbox: southAmericaBbox },
    function (err, items) {
      items.forEach(function (i) { console.log(i.title); });
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

## License

MIT — see `LICENSE`.
