# PMTiles Resources for Réunion Island

This document provides information about available PMTiles resources for Réunion Island.

**Date:** 2025-12-23

---

## What are PMTiles?

PMTiles is a single-file archive format for tiled map data. It enables efficient serving of map tiles without requiring a tile server, making it ideal for offline maps and simplified deployment of web maps.

Key features:
- Cloud-optimized format with HTTP range requests
- No tile server required - can be served as static files
- Efficient storage and bandwidth usage
- Support for vector and raster tiles

---

## Available PMTiles for Réunion Island

### 1. Réunion Island Vector Map

**URL:** `https://www.bus.re/assets/reunion-DskqYIt0.pmtiles`

**Description:** Complete vector map data for Réunion Island, including roads, buildings, points of interest, and other geographic features.

**Use Cases:**
- Interactive web maps with customizable styling
- Routing and navigation applications
- Geographic analysis and visualization
- Offline map applications

**Example Usage:**
```javascript
// Using with MapLibre GL JS
const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {
      'reunion': {
        type: 'vector',
        url: 'pmtiles://https://www.bus.re/assets/reunion-DskqYIt0.pmtiles'
      }
    },
    layers: [
      // Your layer definitions here
    ]
  }
});
```

---

### 2. Réunion Island Terrain

**URL:** `https://www.bus.re/assets/reunion-terrain-DpHRzEjp.pmtiles`

**Description:** Terrain/elevation data for Réunion Island, providing topographic information for 3D visualization and terrain analysis.

**Use Cases:**
- 3D map visualization with terrain
- Elevation profiles and hillshading
- Topographic analysis
- Hiking and outdoor recreation applications

**Example Usage:**
```javascript
// Using with MapLibre GL JS for terrain
const map = new maplibregl.Map({
  container: 'map',
  style: 'your-style.json',
  terrain: {
    source: 'reunion-terrain',
    exaggeration: 1.5
  }
});

map.addSource('reunion-terrain', {
  type: 'raster-dem',
  url: 'pmtiles://https://www.bus.re/assets/reunion-terrain-DpHRzEjp.pmtiles'
});
```

---

## Technical Information

### File Format
PMTiles is a cloud-native archive format that stores map tiles in a single file with:
- Header containing metadata
- Directory structure for tile lookup
- Compressed tile data

### HTTP Range Requests
PMTiles files support HTTP range requests, enabling:
- Efficient streaming of only the tiles needed
- No need to download the entire file
- Low latency for tile access

### Compatibility
PMTiles can be used with:
- **MapLibre GL JS** - Open-source map rendering library
- **Leaflet** - Via PMTiles plugin
- **OpenLayers** - Via PMTiles plugin
- **Mapbox GL JS** - With PMTiles protocol handler

---

## Integration Libraries

### JavaScript/Web
```bash
npm install pmtiles
```

```javascript
import { PMTiles } from 'pmtiles';

const pmtiles = new PMTiles('https://www.bus.re/assets/reunion-DskqYIt0.pmtiles');
const header = await pmtiles.getHeader();
console.log(header);
```

### Protocol Registration
```javascript
import { Protocol } from 'pmtiles';
import maplibregl from 'maplibre-gl';

let protocol = new Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);
```

---

## Resources

- **PMTiles Specification:** https://github.com/protomaps/PMTiles
- **PMTiles Viewer:** https://protomaps.github.io/PMTiles/
- **MapLibre GL JS Documentation:** https://maplibre.org/maplibre-gl-js/docs/

---

## Data Attribution

When using these PMTiles resources, ensure proper attribution is provided according to the data source's requirements. Typically, Réunion Island map data is based on OpenStreetMap and requires attribution:

© OpenStreetMap contributors

---

## File Information

Both PMTiles files are hosted on the bus.re domain, suggesting they may be used for public transportation and mapping applications specific to Réunion Island.

**Note:** The file hashes in the URLs (DskqYIt0 and DpHRzEjp) suggest these are versioned resources. Check for updated versions periodically.
