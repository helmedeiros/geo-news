# Changelog

All notable changes to `geo-news` are recorded here.

## [Unreleased]

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
