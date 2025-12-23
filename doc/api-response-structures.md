# Infotrafic.re API Response Structures

This document details the response structures for Infotrafic.re API endpoints, discovered through JavaScript code analysis and API testing.

**Date:** 2025-12-23

---

## Road Disruptions

### General Disruption Structure

Most disruption endpoints (`/api/road/disruptions/{type}`) return objects where keys are disruption IDs and values contain:

**Common Fields:**
```json
{
  "unique_disruption_number": "string",
  "geolocation": [[lng, lat], ...] | [lng, lat],
  "address": "string",
  "severity level": number,
  "actual start date": "YYYY-MM-DD HH:mm:ss UTC" | "nil",
  "planned start date": "YYYY-MM-DD HH:mm:ss UTC" | "nil",
  "actual end date": "YYYY-MM-DD HH:mm:ss UTC" | "nil",
  "planned end date": "YYYY-MM-DD HH:mm:ss UTC" | "nil",
  "public description": {
    "en": "string",
    "fr": "string"
  } | "nil",
  "short description": {
    "en": "string",
    "fr": "string"
  } | "nil",
  "detailed description": {
    "en": "string",
    "fr": "string"
  } | "nil",
  "private description": {
    "en": "string",
    "fr": "string"
  } | "nil",
  "direction": "string",
  "picture": "url" | ["url1", "url2"] | "nil",
  "source": "string" | "nil",
  "visibility": "yes" | "no",
  "disruption type": "string"
}
```

**Date Formats Supported:**
- `YYYY-MM-DD HH:mm:ss`
- `YYYY-MM-DD HH:mm:ssZ`
- `YYYY-MM-DD HH-mm`
- `DD/MM/YYYY HH:mm`

**Geolocation Types:**
- **Single Point:** `[longitude, latitude]` - Single location
- **Polyline:** `[[lng1, lat1], [lng2, lat2], ...]` - Line or path
- **MultiPoint:** Array of arrays for multiple locations

### Specific Disruption Types

#### Traffic Color (`/api/road/disruptions/trafficolor`)

**Tested Response:**
```json
{
  "62321": {
    "unique disruption number": "RN1_PMV_Stella",
    "actual end date": "2025-12-23 11:41:53 UTC",
    "actual start date": "2025-12-23 11:11:53 UTC",
    "planned end date": "2025-12-23 11:41:53 UTC",
    "planned start date": "2025-12-23 11:11:53 UTC",
    "disruption type": "trafficolor",
    "geolocation": [[55.27, -21.02]],
    "public description": {
      "en": "Smooth traffic",
      "fr": "Trafic fluide"
    },
    "severity level": 2,
    "source": "Labocom",
    "visibility": "yes",
    "options": {
      "trafficolor": "#77F362"
    }
  }
}
```

**Traffic Color Codes:**
- `#77F362` (Green) - Smooth traffic / Trafic fluide
- `#EE7E33` (Orange) - Moderate traffic (34-55 km/h)
- `#EA412C` (Red) - Congested traffic (≤40 km/h)

#### Other Disruption Types

All other disruption endpoints follow the general structure above:
- `/api/road/disruptions/accident`
- `/api/road/disruptions/traffic_jam`
- `/api/road/disruptions/live_jam`
- `/api/road/disruptions/flood`
- `/api/road/disruptions/roadclosure`
- `/api/road/disruptions/hazard`
- `/api/road/disruptions/serious_hazard`
- `/api/road/disruptions/animal`
- `/api/road/disruptions/market`
- `/api/road/disruptions/local_event`
- `/api/road/disruptions/roadworks`

---

## Road Works

### `/api/road/works`

**Response Structure:**
```json
[
  {
    "id": "string | number",
    "geolocation": [[lng, lat], ...] | [lng, lat],
    "address": "string",
    "direction": "string",
    "type": "string",
    "severity": number,
    "Short message": "string",
    "Private message": "string",
    "photo": "url" | null,
    "start date": "DD/MM/YY HH:mm" | "YYYY-MM-DDTHH:mm:ss.SSSZ",
    "end date and hour": "DD/MM/YY HH:mm" | "YYYY-MM-DDTHH:mm:ss.SSSZ",
    "source": "string",
    "updated": "timestamp"
  }
]
```

**Work Types:** Values map to disruption categories through `store.state.road.types`

---

## Road Information

### `/api/road/info/webcam`

**Tested Response:**
```json
{
  "dec_02": {
    "webcam_id": "dec_02",
    "url": "https://www.infotrafic.re/CAM/dec_02.jpeg",
    "geolocation": [55.45, -20.88],
    "public description": "RN2 Ste Marie, Sortie Gillot"
  },
  "dec_09": {
    "webcam_id": "dec_09",
    "url": "https://www.infotrafic.re/CAM/dec_09.jpeg",
    "geolocation": [55.27, -21.02],
    "public description": "RN1 St Paul, Tranchée St Paul"
  }
}
```

**Fields:**
- `webcam_id` - Unique identifier (dec_02 through dec_18)
- `url` - JPEG image URL
- `geolocation` - `[longitude, latitude]`
- `public description` - Location description

---

## Transit Information

### `/api/transit/info/lines`

**Response Structure:**
Direct object structure (no adaptor transformation), stored as-is in Vuex state.

Expected to contain transit line information including:
- Line identifiers
- Route information
- Service details

### `/api/transit/info/stops`

**Response Structure:**
Stop area data stored directly in state as `stop_areas`.

Expected fields:
- Stop identifiers
- Geographic locations
- Stop names
- Associated lines

### `/api/transit/info/stop-points`

**Response Structure:**
Stop point data stored directly in state as `stop_points`.

More granular than stops, representing specific boarding points.

### `/api/transit/disruptions`

**Response Structure:**
Similar to road disruptions but specific to transit services.

Expected to link to stop areas and lines.

---

## Weather Data

### `/api/weather/alert`

**Tested Response:**
```json
{
  "1": {
    "region": "Reunion",
    "risk_level": 1,
    "risk_type": null,
    "timestamp": "2025-07-16 12:18:51"
  }
}
```

**Fields:**
- Numbered keys (1, 2, 3, ...)
- `region` - Geographic area
- `risk_level` - Integer severity (1 = low)
- `risk_type` - Type of weather risk or null
- `timestamp` - UTC timestamp

### `/api/weather/current`

**Query Parameters:**
- `lat` - Latitude (required)
- `lng` - Longitude (required)

**Response:** Not tested (404 error)

### `/api/weather/forecast`

**Query Parameters:**
- `lat` - Latitude (required)
- `lng` - Longitude (required)

**Response:** Not tested

### `/api/weather/aqi`

**Query Parameters:**
- `lat` - Latitude (required)
- `lng` - Longitude (required)

**Tested Response:** Empty `{}`

---

## Geographic & Infrastructure Data

### `/api/floods`

**Response Structure (inferred from adaptor):**
```json
[
  {
    "geolocation": [[lng, lat], ...],
    "type": "flood",
    "severity": number,
    "historic": boolean,
    "details": "string"
  }
]
```

### `/api/agence`

**Response Structure (from adaptor):**
```json
{
  "group_id": {
    "name": "string",
    "phone": "string",
    "email": "string",
    "geometry": {
      "coordinates": [[lng, lat], ...]
    }
  }
}
```

Transformed into agency markers with location, contact info.

### `/api/bus_lines`

**Response:** GeoJSON-like structure with bus line geometries.

### `/api/cycle_path`

**Response:** GeoJSON-like structure with cycling path geometries.

### Risk Area Endpoints

All risk area endpoints return similar GeoJSON structures:

- `/api/flood_risk_areas`
- `/api/fire_risk_areas`
- `/api/fire_grid`
- `/api/tech_risk_areas`

**Expected Structure:**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon | MultiPolygon",
        "coordinates": [...]
      },
      "properties": {
        "risk_type": "string",
        "severity": number,
        "description": "string"
      }
    }
  ]
}
```

---

## Search & Places

### `/api/places/search`

**Query Parameters:**
- `q` - Search query string (required)
- `lat` - Latitude for proximity ranking (required)
- `lng` - Longitude for proximity ranking (required)

**Response:** Array of location suggestions

Expected to return autocomplete results for address/place search.

---

## Journey Planning

### `/api/journeys`

**Request:** POST with journey parameters (origin, destination, modes, time)

**Response:** Journey options with routes, segments, and instructions.

Used by the journey planning module for calculating routes.

---

## Cache Management

### `/api/device/lastModified`

**Purpose:** Track last-modified timestamps for client-side caching.

**Mechanism:**
- Client sends `If-Modified-Since` header
- Server returns `304 Not Modified` if data unchanged
- Server returns `200 OK` with new data if changed

**Used for endpoints:**
- Road disruptions (per type)
- Transit data
- Weather information

---

## Data Types & Conventions

### Localized Text

Many description fields support bilingual content:
```json
{
  "en": "English text",
  "fr": "Texte français"
}
```

### Nil Values

The API uses `"nil"` string to represent null/empty values instead of JSON `null`.

### Geometry Formats

**Single Point:**
```json
[longitude, latitude]
```

**Polyline/Path:**
```json
[[lng1, lat1], [lng2, lat2], [lng3, lat3]]
```

**MultiPoint:**
```json
[
  [[lng1, lat1], [lng2, lat2]],
  [[lng3, lat3], [lng4, lat4]]
]
```

### Date/Time Handling

- Dates stored in UTC
- Frontend adds 4 hours offset (Réunion timezone: UTC+4)
- Multiple format support for compatibility
- `moment.js` used for parsing and manipulation

---

## Response Filtering

### Disruption Filter

Endpoints support optional query parameters:
- `filter` - Filter criteria
- `refresh` - Force refresh ("true")

Example: `/api/road/disruptions/accident?filter=current&refresh=true`

### Visibility

Disruptions can be hidden with `"visibility": "no"` field.
Frontend filters these from display.

---

## Error Handling

### HTTP Status Codes

- `200 OK` - Successful response with data
- `304 Not Modified` - Cached data still valid
- `404 Not Found` - Endpoint doesn't exist
- `500 Internal Server Error` - Server-side error

### Empty Responses

`{}` indicates no current data (not an error state).
Common for disruption endpoints when no incidents exist.

---

## Notes

1. **Response structures inferred** from JavaScript data adaptors in `vfs.min.js`
2. **Not all endpoints tested** - some structures are theoretical based on code
3. **Field names may vary** - API uses various naming conventions
4. **Backward compatibility** - Multiple date formats suggest API version evolution
5. **Authentication** - Some endpoints require authentication (managed by frontend)
