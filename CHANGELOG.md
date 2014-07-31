# Changelog

All notable changes to `geo-news` are recorded here.

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
