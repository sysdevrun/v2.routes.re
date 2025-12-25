#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the source JSON
const inputPath = path.join(__dirname, '../tmp/trafficolor.json');
const outputPath = path.join(__dirname, '../src/data/trafficolor.json');

const sourceData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// Transform to GeoJSON FeatureCollection
const features = Object.entries(sourceData).map(([key, entry]) => ({
  type: 'Feature',
  properties: {
    id: entry['unique disruption number'],
    disruption_type: entry['disruption type'],
    severity_level: entry['severity level'],
    trafficolor: entry.options?.trafficolor || '#77F362',
    public_description_fr: entry['public description']?.fr || '',
    public_description_en: entry['public description']?.en || '',
    source: entry.source,
    visibility: entry.visibility,
  },
  geometry: {
    type: 'LineString',
    coordinates: entry.geolocation || [],
  },
}));

const geoJson = {
  type: 'FeatureCollection',
  features,
};

// Write the output
fs.writeFileSync(outputPath, JSON.stringify(geoJson, null, 2));

console.log(`Transformed ${features.length} features to ${outputPath}`);
