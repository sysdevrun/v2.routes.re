import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from 'pmtiles';
import { layers, namedFlavor } from '@protomaps/basemaps';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { ScatterplotLayer } from '@deck.gl/layers';
import type { MapEvent, Webcam } from '../types/events';

const PMTILES_VECTOR = 'pmtiles://https://www.bus.re/assets/reunion-DskqYIt0.pmtiles';
const PMTILES_TERRAIN = 'pmtiles://https://www.bus.re/assets/reunion-terrain-DpHRzEjp.pmtiles?type=hillshade';

// Réunion Island center coordinates
const REUNION_CENTER: [number, number] = [55.536, -21.115];
const INITIAL_ZOOM = 10;

// Convert hex color to RGB array
function hexToRgb(hex: string): [number, number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), 255];
  }
  return [107, 114, 128, 255]; // gray-500 default
}

interface MapProps {
  events: MapEvent[];
  webcams: Webcam[];
  selectedEvent: MapEvent | null;
  onEventSelect: (event: MapEvent | null) => void;
}

export default function Map({ events, webcams, selectedEvent, onEventSelect }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const deckOverlay = useRef<MapboxOverlay | null>(null);
  const webcamMarkers = useRef<maplibregl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [webcamRefreshKey, setWebcamRefreshKey] = useState(0);
  const [currentZoom, setCurrentZoom] = useState(INITIAL_ZOOM);

  // Refresh webcams every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setWebcamRefreshKey(prev => prev + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Register PMTiles protocol
    const protocol = new Protocol();
    maplibregl.addProtocol('pmtiles', protocol.tile);

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
        sprite: 'https://protomaps.github.io/basemaps-assets/sprites/v4/light',
        sources: {
          protomaps: {
            type: 'vector',
            url: PMTILES_VECTOR,
            attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
          },
          'reunion-terrain': {
            type: 'raster-dem',
            url: PMTILES_TERRAIN,
            encoding: 'terrarium',
          },
        },
        layers: [
          ...layers('protomaps', namedFlavor('light'), { lang: 'fr' }),
          {
            id: 'hillshading',
            source: 'reunion-terrain',
            type: 'hillshade',
            paint: {
              'hillshade-exaggeration': 0.1,
            },
          },
        ],
      },
      center: REUNION_CENTER,
      zoom: INITIAL_ZOOM,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.ScaleControl(), 'bottom-left');

    // Create deck.gl overlay
    deckOverlay.current = new MapboxOverlay({
      layers: [],
    });
    map.current.addControl(deckOverlay.current as unknown as maplibregl.IControl);

    map.current.on('load', () => {
      // Add highlight layer for national roads (ref starting with N)
      map.current!.addLayer({
        id: 'national-roads-highlight',
        type: 'line',
        source: 'protomaps',
        'source-layer': 'roads',
        filter: [
          'all',
          ['has', 'ref'],
          ['==', ['slice', ['get', 'ref'], 0, 1], 'N'],
        ],
        paint: {
          'line-color': '#2563eb',
          'line-width': 6,
          'line-opacity': 0.5,
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
      });

      setMapLoaded(true);
    });

    map.current.on('zoom', () => {
      if (map.current) {
        setCurrentZoom(map.current.getZoom());
      }
    });

    return () => {
      maplibregl.removeProtocol('pmtiles');
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update deck.gl layers when data changes
  const updateLayers = useCallback(() => {
    if (!deckOverlay.current || !mapLoaded) return;

    const eventsLayer = new ScatterplotLayer({
      id: 'events-layer',
      data: events,
      pickable: true,
      opacity: 0.9,
      stroked: true,
      filled: true,
      radiusScale: 1,
      radiusMinPixels: 8,
      radiusMaxPixels: 20,
      lineWidthMinPixels: 2,
      getPosition: (d: MapEvent) => d.coordinates,
      getRadius: 12,
      getFillColor: (d: MapEvent) => hexToRgb(d.color || '#6B7280'),
      getLineColor: [255, 255, 255, 255],
      onClick: ({ object }) => {
        if (object) {
          onEventSelect(object as MapEvent);
        }
      },
    });

    deckOverlay.current.setProps({
      layers: [eventsLayer],
    });
  }, [events, mapLoaded, onEventSelect]);

  useEffect(() => {
    updateLayers();
  }, [updateLayers]);

  // Manage webcam HTML markers (images need browser img tags due to CORS)
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing webcam markers
    webcamMarkers.current.forEach(marker => marker.remove());
    webcamMarkers.current = [];

    // Calculate scale based on zoom - below 10, scale with map
    const getScale = (zoom: number) => {
      if (zoom >= 10) return 1;
      // Scale down as we zoom out below 10
      return Math.pow(2, zoom - 10);
    };
    const scale = getScale(currentZoom);
    const baseWidth = 160;
    const baseHeight = 120;
    const scaledWidth = Math.max(baseWidth * scale, 20); // minimum 20px
    const scaledHeight = Math.max(baseHeight * scale, 15);

    // Create new webcam markers
    webcams.forEach(webcam => {
      const el = document.createElement('div');
      el.className = 'webcam-marker';
      el.style.cursor = 'pointer';

      const img = document.createElement('img');
      img.src = `${webcam.url}?rand=${webcamRefreshKey}`;
      img.style.width = `${scaledWidth}px`;
      img.style.height = `${scaledHeight}px`;
      img.style.borderRadius = '4px';
      img.style.border = '2px solid white';
      img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      img.alt = webcam.description;

      el.appendChild(img);
      el.addEventListener('click', () => {
        window.open(webcam.url, '_blank');
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat(webcam.coordinates)
        .addTo(map.current!);

      webcamMarkers.current.push(marker);
    });

    return () => {
      webcamMarkers.current.forEach(marker => marker.remove());
      webcamMarkers.current = [];
    };
  }, [webcams, mapLoaded, webcamRefreshKey, currentZoom]);

  // Pan to selected event
  useEffect(() => {
    if (!map.current || !selectedEvent) return;

    map.current.flyTo({
      center: selectedEvent.coordinates,
      zoom: 14,
    });
  }, [selectedEvent]);

  return (
    <div ref={mapContainer} className="w-full h-full" />
  );
}
