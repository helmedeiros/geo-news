# geo-news

Geolocalised news for the Americas.

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

## Status

Pre-1.0. Domain, ports, RSS adapter and the seed of the portal registry are
in. Location extraction and the map UI are next.

## License

MIT — see `LICENSE`.
