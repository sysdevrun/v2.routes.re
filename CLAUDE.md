# Routes Réunion - Project Documentation

Real-time road events visualization for La Réunion island.

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **MapLibre GL JS** for map rendering
- **PMTiles** for vector tiles (hosted on bus.re)
- **@protomaps/basemaps** for map styling
- **deck.gl** for WebGL data visualization layers
- **@turf/boolean-point-in-polygon** for geographic point-in-polygon detection

## Project Structure

```
src/
├── components/
│   ├── Map.tsx           # Main map component with MapLibre + deck.gl
│   ├── RoadStatus.tsx    # Route status blocks above map
│   ├── EventsList.tsx    # Sidebar event list
│   └── EventDetails.tsx  # Event detail popup
├── data/
│   └── reunionRoutes.ts  # GeoJSON polygons for main routes
├── services/
│   └── api.ts            # API service + webcam data
└── types/
    └── events.ts         # TypeScript type definitions
```

## Key Components

### Map.tsx
- Uses MapLibre GL JS with PMTiles protocol for vector tiles
- Terrain/hillshade from raster-dem PMTiles with terrarium encoding
- deck.gl overlay for events (ScatterplotLayer) and webcam dots
- HTML markers for webcam images (CORS workaround - server blocks non-browser requests)
- Highlights national roads (ref starting with 'N') in red
- Webcam images scale with zoom level below zoom 10

### RoadStatus.tsx
- Displays status blocks for 5 main routes
- Uses turf.js `booleanPointInPolygon` to detect events within route polygons
- Color coding: green (normal), amber (warning), red (danger)

### API Service
Currently uses fake data for testing. To restore real API:
```typescript
// Replace fetchAllEvents with real implementation calling:
// https://www.infotrafic.re/api/road/disruptions/{type}
// https://www.infotrafic.re/api/road/works
```

## Data Sources

- **Vector tiles**: `pmtiles://https://www.bus.re/assets/reunion-DskqYIt0.pmtiles`
- **Terrain**: `pmtiles://https://www.bus.re/assets/reunion-terrain-DpHRzEjp.pmtiles`
- **Road events**: https://www.infotrafic.re/api/
- **Webcams**: Static list from infotrafic.re (13 cameras)

## Route Polygons

Defined in `src/data/reunionRoutes.ts`:
- Route du Littoral
- Rampes de la Montagne
- Route de Cilaos
- Route des Laves
- Route de Salazie

## Build & Deploy

```bash
npm install
npm run dev      # Development server
npm run build    # Production build
```

Deployed via GitHub Actions to GitHub Pages (see `.github/workflows/deploy.yml`).

## Notes

- Webcam images use HTML img tags instead of deck.gl IconLayer because the infotrafic.re server returns 403 for non-browser requests (Cloudflare protection)
- Webcam refresh interval: 10 seconds with cache-busting query param
- Events refresh interval: 5 minutes
