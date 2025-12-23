# Infotrafic.re API Documentation

This document provides an overview of the Infotrafic.re API endpoints and their responses.

**Date:** 2025-12-23

---

## Road Disruptions Endpoints

### 1. Accidents
**Endpoint:** `https://www.infotrafic.re/api/road/disruptions/accident`

**Status:** ✓ Success (Empty Response)

**Response:**
```json
{}
```

**Description:** Returns an empty JSON object. This indicates there are currently no accidents reported in the system.

---

### 2. Live Traffic Jams
**Endpoint:** `https://www.infotrafic.re/api/road/disruptions/live_jam`

**Status:** ✓ Success (Empty Response)

**Response:**
```json
{}
```

**Description:** Returns an empty JSON object. No live traffic jams are currently being reported.

---

### 3. Traffic Jams
**Endpoint:** `https://www.infotrafic.re/api/road/disruptions/traffic_jam`

**Status:** ✓ Success (Empty Response)

**Response:**
```json
{}
```

**Description:** Returns an empty JSON object. No traffic jams are currently reported in the system.

---

### 4. Traffic Color Status
**Endpoint:** `https://www.infotrafic.re/api/road/disruptions/trafficolor`

**Status:** ✓ Success

**Response Structure:**
The API returns a JSON object with 54+ traffic entries (IDs: 62321-62960+), each containing:

- **actual_end_date** (string): End timestamp in UTC (e.g., "2025-12-23 11:41:53 UTC")
- **actual_start_date** (string): Start timestamp in UTC (e.g., "2025-12-23 11:11:53 UTC")
- **planned_end_date** (string): Planned end timestamp in UTC
- **planned_start_date** (string): Planned start timestamp in UTC
- **disruption_type** (string): Always "trafficolor" for this endpoint
- **geolocation** (array): Array of [longitude, latitude] coordinates
- **public_description** (object): Bilingual traffic status messages (English/French)
- **severity_level** (integer): Traffic severity (e.g., 2)
- **source** (string): Data source (e.g., "Labocom")
- **trafficolor** (string): Hex color code indicating traffic status
- **unique_disruption_number** (string): Route identifier
- **visibility** (string): "yes" or "no"

**Traffic Color Codes:**
- **#77F362** (Green): "Smooth traffic" / "Trafic fluide"
- **#EA412C** (Red): Congested - "Average speed: 40 km/h"
- **#EE7E33** (Orange): Moderate - "Average speed: 34-55 km/h"

**Geographic Coverage:**
Routes tracked include RN1, RN2, RN3, RN6 with named checkpoints (PMV locations like Stella, Portail, Étang Salé, etc.).

**Example Entry:**
```json
{
  "62321": {
    "actual_end_date": "2025-12-23 11:41:53 UTC",
    "actual_start_date": "2025-12-23 11:11:53 UTC",
    "disruption_type": "trafficolor",
    "geolocation": [[55.123, -21.456]],
    "public_description": {
      "en": "Smooth traffic",
      "fr": "Trafic fluide"
    },
    "severity_level": 2,
    "source": "Labocom",
    "trafficolor": "#77F362",
    "unique_disruption_number": "RN1_PMV_Stella",
    "visibility": "yes"
  }
}
```

**Description:** Returns comprehensive real-time traffic status data for major roads across Réunion Island, using color-coded indicators to show traffic flow conditions.

---

### 5. Animal Hazards
**Endpoint:** `https://www.infotrafic.re/api/road/disruptions/animal`

**Status:** ✗ Error (500 Internal Server Error)

**Error Message:** Request failed with status code 500

**Description:** API cannot be explored for now because of a server error. This endpoint would typically report animal-related road hazards.

---

### 6. Serious Hazards
**Endpoint:** `https://www.infotrafic.re/api/road/disruptions/serious_hazard`

**Status:** ✗ Error (500 Internal Server Error)

**Error Message:** Request failed with status code 500

**Description:** API cannot be explored for now because of a server error. This endpoint would report serious road hazards.

---

### 7. General Hazards
**Endpoint:** `https://www.infotrafic.re/api/road/disruptions/hazard`

**Status:** ✗ Error (500 Internal Server Error)

**Error Message:** Request failed with status code 500

**Description:** API cannot be explored for now because of a server error. This endpoint would report general road hazards.

---

### 8. Road Closures
**Endpoint:** `https://www.infotrafic.re/api/road/disruptions/roadclosure`

**Status:** ✓ Success (Empty Response)

**Response:**
```json
{}
```

**Description:** Returns an empty JSON object. No road closures are currently active.

---

### 9. Floods
**Endpoint:** `https://www.infotrafic.re/api/road/disruptions/flood`

**Status:** ✓ Success (Empty Response)

**Response:**
```json
{}
```

**Description:** Returns an empty JSON object. No flood-related disruptions are currently reported.

---

### 10. Markets
**Endpoint:** `https://www.infotrafic.re/api/road/disruptions/market`

**Status:** ✓ Success (Empty Response)

**Response:**
```json
{}
```

**Description:** Returns an empty JSON object. No market-related traffic disruptions are currently active.

---

### 11. Local Events
**Endpoint:** `https://www.infotrafic.re/api/road/disruptions/local_event`

**Status:** ✓ Success (Empty Response)

**Response:**
```json
{}
```

**Description:** Returns an empty JSON object. No local events affecting traffic are currently reported.

---

### 12. Roadworks
**Endpoint:** `https://www.infotrafic.re/api/road/disruptions/roadworks`

**Status:** ✓ Success (Empty Response)

**Response:**
```json
{}
```

**Description:** Returns an empty JSON object. No roadworks are currently reported in the system.

---

## Weather Endpoints

### 13. Current Weather
**Endpoint:** `https://www.infotrafic.re/api/weather/current?lat=-21.1150051&lng=55.508862`

**Status:** ✗ Error (404 Not Found)

**Error Message:** Request failed with status code 404

**Description:** API cannot be explored for now because the endpoint was not found. This endpoint would provide current weather conditions for the specified coordinates (Saint-Denis area, Réunion Island).

---

### 14. Weather Alerts
**Endpoint:** `https://www.infotrafic.re/api/weather/alert`

**Status:** ✓ Success

**Response:**
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

**Response Structure:**
- **Numbered Records:** Each alert is indexed by a number (starting from 1)
- **region** (string): Geographic area for the alert (e.g., "Reunion")
- **risk_level** (integer): Severity level of the risk (1 appears to be low risk)
- **risk_type** (null/string): Category of risk (null indicates no specific risk type)
- **timestamp** (string): UTC timestamp of when the alert was generated (format: YYYY-MM-DD HH:MM:SS)

**Description:** Returns current weather alert information for Réunion Island. In this response, there is one alert record indicating risk level 1 (low) with no specific risk type, suggesting minimal weather concerns at the time of the query.

---

### 15. Air Quality Index (AQI)
**Endpoint:** `https://www.infotrafic.re/api/weather/aqi?lat=-21.1150051&lng=55.508862`

**Status:** ✓ Success (Empty Response)

**Response:**
```json
{}
```

**Description:** Returns an empty JSON object. No air quality index data is available for the specified coordinates.

---

## Summary

### Working Endpoints (10 total)
- `/api/road/disruptions/accident` - Empty (no accidents)
- `/api/road/disruptions/live_jam` - Empty (no live jams)
- `/api/road/disruptions/traffic_jam` - Empty (no traffic jams)
- `/api/road/disruptions/trafficolor` - Returns real-time traffic color status (54+ entries)
- `/api/road/disruptions/roadclosure` - Empty (no closures)
- `/api/road/disruptions/flood` - Empty (no floods)
- `/api/road/disruptions/market` - Empty (no market disruptions)
- `/api/road/disruptions/local_event` - Empty (no events)
- `/api/road/disruptions/roadworks` - Empty (no roadworks)
- `/api/weather/alert` - Returns weather alert data

### Failed Endpoints (4 total)
- `/api/road/disruptions/animal` - 500 Internal Server Error
- `/api/road/disruptions/serious_hazard` - 500 Internal Server Error
- `/api/road/disruptions/hazard` - 500 Internal Server Error
- `/api/weather/current` - 404 Not Found

### Empty Response Endpoints (1 total)
- `/api/weather/aqi` - Empty (no AQI data)

**Note:** The empty responses for road disruption endpoints suggest that at the time of this query (2025-12-23), there were no active incidents of those types on Réunion Island roads. The 500 errors indicate server-side issues that prevent exploration of those endpoints at this time.
