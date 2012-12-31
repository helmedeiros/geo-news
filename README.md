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

## Status

Pre-1.0. Domain, ports and a couple of in-memory adapters are in place; the
RSS adapter and the curated portal registry land next.

## License

MIT — see `LICENSE`.
