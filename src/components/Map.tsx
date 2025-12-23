import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from 'pmtiles';
import type { MapEvent } from '../types/events';

const PMTILES_VECTOR = 'pmtiles://https://www.bus.re/assets/reunion-DskqYIt0.pmtiles';

// Réunion Island center coordinates
const REUNION_CENTER: [number, number] = [55.536, -21.115];
const INITIAL_ZOOM = 10;

interface MapProps {
  events: MapEvent[];
  selectedEvent: MapEvent | null;
  onEventSelect: (event: MapEvent | null) => void;
}

export default function Map({ events, selectedEvent, onEventSelect }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Register PMTiles protocol
    const protocol = new Protocol();
    maplibregl.addProtocol('pmtiles', protocol.tile);

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        name: 'Réunion',
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
        sources: {
          'reunion-vector': {
            type: 'vector',
            url: PMTILES_VECTOR,
          },
        },
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: {
              'background-color': '#89CFF0',
            },
          },
          {
            id: 'landcover',
            type: 'fill',
            source: 'reunion-vector',
            'source-layer': 'landcover',
            paint: {
              'fill-color': [
                'match',
                ['get', 'class'],
                'grass', '#c8e6c9',
                'wood', '#81c784',
                'farmland', '#dcedc8',
                '#e8f5e9',
              ],
              'fill-opacity': 0.7,
            },
          },
          {
            id: 'landuse',
            type: 'fill',
            source: 'reunion-vector',
            'source-layer': 'landuse',
            paint: {
              'fill-color': [
                'match',
                ['get', 'class'],
                'residential', '#f5f5f5',
                'commercial', '#fff3e0',
                'industrial', '#eceff1',
                '#fafafa',
              ],
              'fill-opacity': 0.5,
            },
          },
          {
            id: 'water',
            type: 'fill',
            source: 'reunion-vector',
            'source-layer': 'water',
            paint: {
              'fill-color': '#64b5f6',
            },
          },
          {
            id: 'waterway',
            type: 'line',
            source: 'reunion-vector',
            'source-layer': 'waterway',
            paint: {
              'line-color': '#64b5f6',
              'line-width': 1,
            },
          },
          {
            id: 'building',
            type: 'fill',
            source: 'reunion-vector',
            'source-layer': 'building',
            paint: {
              'fill-color': '#d7ccc8',
              'fill-opacity': 0.7,
            },
          },
          {
            id: 'road-minor',
            type: 'line',
            source: 'reunion-vector',
            'source-layer': 'transportation',
            filter: ['in', 'class', 'minor', 'service', 'path'],
            paint: {
              'line-color': '#ffffff',
              'line-width': 1,
            },
          },
          {
            id: 'road-secondary',
            type: 'line',
            source: 'reunion-vector',
            'source-layer': 'transportation',
            filter: ['in', 'class', 'secondary', 'tertiary'],
            paint: {
              'line-color': '#fff9c4',
              'line-width': 2,
            },
          },
          {
            id: 'road-primary',
            type: 'line',
            source: 'reunion-vector',
            'source-layer': 'transportation',
            filter: ['==', 'class', 'primary'],
            paint: {
              'line-color': '#ffcc80',
              'line-width': 3,
            },
          },
          {
            id: 'road-trunk',
            type: 'line',
            source: 'reunion-vector',
            'source-layer': 'transportation',
            filter: ['in', 'class', 'trunk', 'motorway'],
            paint: {
              'line-color': '#ef9a9a',
              'line-width': 4,
            },
          },
          {
            id: 'place-village',
            type: 'symbol',
            source: 'reunion-vector',
            'source-layer': 'place',
            filter: ['==', 'class', 'village'],
            layout: {
              'text-field': ['get', 'name'],
              'text-size': 11,
              'text-anchor': 'center',
            },
            paint: {
              'text-color': '#424242',
              'text-halo-color': '#ffffff',
              'text-halo-width': 1,
            },
          },
          {
            id: 'place-town',
            type: 'symbol',
            source: 'reunion-vector',
            'source-layer': 'place',
            filter: ['==', 'class', 'town'],
            layout: {
              'text-field': ['get', 'name'],
              'text-size': 13,
              'text-anchor': 'center',
            },
            paint: {
              'text-color': '#212121',
              'text-halo-color': '#ffffff',
              'text-halo-width': 1.5,
            },
          },
          {
            id: 'place-city',
            type: 'symbol',
            source: 'reunion-vector',
            'source-layer': 'place',
            filter: ['==', 'class', 'city'],
            layout: {
              'text-field': ['get', 'name'],
              'text-size': 16,
              'text-anchor': 'center',
              'text-font': ['Open Sans Bold'],
            },
            paint: {
              'text-color': '#000000',
              'text-halo-color': '#ffffff',
              'text-halo-width': 2,
            },
          },
        ],
      },
      center: REUNION_CENTER,
      zoom: INITIAL_ZOOM,
      pitch: 0,
      bearing: 0,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.ScaleControl(), 'bottom-left');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      maplibregl.removeProtocol('pmtiles');
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers when events change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    events.forEach(event => {
      const el = document.createElement('div');
      el.className = 'event-marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = event.color || '#6B7280';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.2s';

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.3)';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onEventSelect(event);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(event.coordinates)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [events, mapLoaded, onEventSelect]);

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
