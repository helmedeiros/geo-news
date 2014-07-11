# Changelog

All notable changes to `geo-news` are recorded here.

## [1.4.0] — 2014-07-11

### Added — operational hardening before a pause

- `BinaryHttpClient` adapter with redirect-following and a size cap, used by
  the new `scripts/cache-og-images.js` pass that downloads each item's OG
  thumbnail into `web/data/og/{hash}.{ext}` and rewrites `item.image` to a
  local path. Stops hot-linking publisher CDNs.
- `scripts/verify-live.sh` headless-Chrome smoke test that pulls the live
  page, retries up to 2 minutes for Pages publication, and fails if zero
  `class="headline"` rows render. Wired in as the deploy script's final
  gate.
- `.github/workflows/deploy.yml` — GitHub Actions cron (every 6h) that
  runs lint + tests + dataset build + image cache + Pages publish, and
  invokes `verify-live.sh` as its own gate. Removes the manual-deploy
  staleness risk and turns silent breakage into a failed workflow run.
- `newsItem.mutableCopy(item)` — explicit unfreeze for consumers (notably
  the dataset build) that need to attach derived fields. Closes the
  silent-throw-in-async-callback footgun the OG enrichment hit in v1.3.0.

### Changed

- `NodeHttpClient` migrated from deprecated `url.parse` to the WHATWG
  `URL` API. Same external behaviour, no more Node deprecation warning.
- README rewritten with an honest "Status & known limitations" section
  covering Google News ToS exposure, OG hot-linking, snippet-licensing
  regimes (EU Article 15 / C-18 / PL 2630), publisher-mode lumping
  Google News portals at country capitals, the small (32-city) bundled
  gazetteer, and a correction that the package is not yet on npm.

## [1.3.0] — 2014-07-30

### Added
- `OgExtractor` adapter parses OpenGraph and standard `<head>` metadata from
  an article URL (image, title, description).
- Deploy script enriches the newest 400 items with OG image + description
  so the UI can render a click-to-preview panel.
- New `HeadlinePreviewView` opens a right-side panel on headline click with
  the OG image, a clamped lead paragraph and a "Read on {source} →" CTA
  that opens the publisher's page in a new tab. Stays inside publisher-
  supplied snippet metadata — no full-article rendering, no iframe.

### Fixed
- Build script copies items out of their frozen domain shape before writing
  OG fields; otherwise `item.image = …` threw inside the async callback
  and silently dropped every successful enrichment.

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
