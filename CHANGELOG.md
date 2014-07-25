# Changelog

All notable changes to `geo-news` are recorded here.

## [1.2.0] — 2014-07-25

### Added
- Map markers are clustered via leaflet.markercluster — the 1000+-item
  default view stays readable instead of piling up at each city centre.
- Sidebar gains a date-range filter (last hour / 24h / week / month /
  anytime) and a "Showing N of M" count under the toolbar.

## [1.1.0] — 2014-07-28

### Added
- `lib/src/registry/google-news-portals.json` — one Google News country-RSS
  aggregator per Americas country, merged into `fromBundled()`. Lights up
  every country on the map with ~30+ fresh items each.
- Sidebar gains the standard newsroom toolbar: search input, sort dropdown
  (newest / oldest / source A→Z), source filter dropdown rebuilt from
  whatever is in the current map view.
- Sidebar click pans and zooms the map to that headline's marker.

### Fixed
- `NodeHttpClient` now follows up to 5 redirects, so providers that 302
  (Google News, several Latin American outlets) actually return their body.

## [1.0.2] — 2014-07-31

### Fixed
- UI rendered no markers when the deploy fetched items from a portal absent
  from the hand-rolled `portals.sample.json` subset. The web portal lookup
  is now generated from the library's full registry via `sync-web-portals`,
  and the deploy script runs it before publishing.

## [1.0.1] — 2014-07-30

### Added
- `examples/embed.js` proves third-party embed in under 50 LOC.
- UI sorts the headline sidebar newest-first.
- UI marker popups show the portal display name, not the slug.

### Changed
- Generated `web/data/headlines.json` is gitignored; deploy script writes
  it fresh from the bundled portals.

## [1.0.0] — 2014-07-01

### Added
- Domain layer: `NewsItem`, `Portal`, `Coordinate`, `BoundingBox`, `Region`,
  `Country`, the curated `countries` list and `haversineKm` helper.
- Ports: `NewsFeedPort`, `NewsRepositoryPort`, `PortalRegistryPort`,
  `ClockPort`, `LocationExtractorPort`, `GeocoderPort`.
- Adapters: `InMemoryRepository`, `InMemoryPortalRegistry`, `SystemClock`,
  `RssAdapter` + `RssParser` (RSS 2.0 and Atom), `NodeHttpClient`,
  `htmlEntities` decoder, `feedErrors`, `GazetteerExtractor`,
  `NominatimGeocoder`, `CompositeExtractor`.
- Application use-cases: `IndexNewsUseCase`, `IndexAllUseCase`,
  `ExtractLocationsUseCase`, `QueryByRegionUseCase` (publisher and event
  modes).
- Curated bundled registries: 48 portals across 16 Americas countries,
  Americas region presets, Americas city gazetteer.
- Reference UI under `web/`: Leaflet + OSM map, mode toggle, headline list,
  region presets, bookmarkable URL hash, responsive sidebar.

### Documentation
- README usage example, mode explanation and bundled portals table.
- `web/README.md` with layout and running instructions.

## [0.0.1] — 2012-04-03

- Repository scaffold.
