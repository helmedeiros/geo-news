# geo-news-web

Reference UI for [`geo-news`](../). Static, single-page, deployable straight to
GitHub Pages.

## Running locally

The UI is plain HTML + CSS + JS that loads vendor libraries from CDNs and
reads its dataset from `data/*.sample.json`. Any static file server works:

```
cd web
python3 -m http.server 8000
open http://localhost:8000
```

## Layout

```
web/
├── index.html             entry point
├── css/app.css            layout and theme
├── js/
│  ├── app.js              boot — loads dataset, wires views
│  ├── controllers/        thin model-view glue
│  ├── models/             Backbone models + collections
│  └── views/              Backbone views (map, sidebar, toggle)
└── data/
   ├── headlines.sample.json   pre-baked NewsItem-shaped objects
   └── portals.sample.json     portal-id → lat/lon/name/country lookup
```

## Replacing the sample dataset

Run `node examples/poll-and-query.js` from the repo root to fetch real RSS
feeds, then export the items to `web/data/headlines.json`. The boot script
looks for `data/headlines.json` first and falls back to the sample file.

## Modes

* **publisher** — markers placed at the publishing portal's city.
* **event** — markers placed at the first location extracted from the story.

Toggle from the header.
