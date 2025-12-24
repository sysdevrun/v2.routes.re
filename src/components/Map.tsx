import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from 'pmtiles';
import { layers, namedFlavor } from '@protomaps/basemaps';
import type { MapEvent, Webcam } from '../types/events';

const PMTILES_VECTOR = 'pmtiles://https://www.bus.re/assets/reunion-DskqYIt0.pmtiles';
const PMTILES_TERRAIN = 'pmtiles://https://www.bus.re/assets/reunion-terrain-DpHRzEjp.pmtiles';

// Réunion Island center coordinates
const REUNION_CENTER: [number, number] = [55.536, -21.115];
const INITIAL_ZOOM = 10;

interface MapProps {
  events: MapEvent[];
  webcams: Webcam[];
  selectedEvent: MapEvent | null;
  onEventSelect: (event: MapEvent | null) => void;
}

export default function Map({ events, webcams, selectedEvent, onEventSelect }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const webcamMarkersRef = useRef<maplibregl.Marker[]>([]);
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
            tileSize: 256,
            encoding: 'terrarium',
          },
        },
        layers: layers('protomaps', namedFlavor('light'), { lang: 'fr' }),
      },
      center: REUNION_CENTER,
      zoom: INITIAL_ZOOM,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.ScaleControl(), 'bottom-left');

    map.current.on('load', () => {
      // Add hillshade layer at the bottom
      const firstLayerId = map.current!.getStyle().layers[0]?.id;
      map.current!.addLayer(
        {
          id: 'hillshade',
          type: 'hillshade',
          source: 'reunion-terrain',
          paint: {
            'hillshade-shadow-color': '#473B24',
            'hillshade-illumination-anchor': 'viewport',
            'hillshade-exaggeration': 0.5,
          },
        },
        firstLayerId
      );

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
          'line-color': '#dc2626',
          'line-width': 6,
          'line-opacity': 0.8,
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
      });

      setMapLoaded(true);
    });

    return () => {
      maplibregl.removeProtocol('pmtiles');
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update event markers when events change
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

  // Update webcam markers when webcams change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const BASE_WIDTH = 120;
    const BASE_HEIGHT = 90;
    const BASE_ZOOM = 10;

    // Function to update webcam sizes based on zoom
    const updateWebcamSizes = () => {
      const zoom = map.current!.getZoom();
      let scale = 1;
      if (zoom < BASE_ZOOM) {
        scale = Math.pow(2, zoom - BASE_ZOOM);
      }
      const width = Math.round(BASE_WIDTH * scale);
      const height = Math.round(BASE_HEIGHT * scale);

      webcamMarkersRef.current.forEach(marker => {
        const el = marker.getElement();
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
      });
    };

    // Clear existing webcam markers
    webcamMarkersRef.current.forEach(marker => marker.remove());
    webcamMarkersRef.current = [];

    // Add webcam image markers
    webcams.forEach(webcam => {
      const el = document.createElement('div');
      el.className = 'webcam-marker';
      el.style.width = `${BASE_WIDTH}px`;
      el.style.height = `${BASE_HEIGHT}px`;
      el.style.borderRadius = '8px';
      el.style.overflow = 'hidden';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
      el.style.cursor = 'pointer';
      el.style.transition = 'box-shadow 0.2s';
      el.style.backgroundColor = '#1f2937';

      const img = document.createElement('img');
      img.src = `${webcam.url}?rand=${Math.random().toString(36).substring(2)}`;
      img.alt = webcam.description;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.loading = 'lazy';

      // Reload image every 10 seconds with random string to prevent caching
      const refreshInterval = setInterval(() => {
        img.src = `${webcam.url}?rand=${Math.random().toString(36).substring(2)}`;
      }, 10000);

      el.appendChild(img);

      // Add label
      const label = document.createElement('div');
      label.style.position = 'absolute';
      label.style.bottom = '0';
      label.style.left = '0';
      label.style.right = '0';
      label.style.padding = '4px 6px';
      label.style.backgroundColor = 'rgba(0,0,0,0.7)';
      label.style.color = 'white';
      label.style.fontSize = '10px';
      label.style.lineHeight = '1.2';
      label.style.whiteSpace = 'nowrap';
      label.style.overflow = 'hidden';
      label.style.textOverflow = 'ellipsis';
      label.textContent = webcam.description;
      el.style.position = 'relative';
      el.appendChild(label);

      el.addEventListener('mouseenter', () => {
        el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.5)';
        el.style.zIndex = '10';
      });

      el.addEventListener('mouseleave', () => {
        el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        el.style.zIndex = '1';
      });

      el.addEventListener('click', () => {
        window.open(webcam.url, '_blank');
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat(webcam.coordinates)
        .addTo(map.current!);

      webcamMarkersRef.current.push(marker);

      // Store interval for cleanup
      (marker as unknown as { _refreshInterval: number })._refreshInterval = refreshInterval;
    });

    // Listen for zoom changes
    map.current.on('zoom', updateWebcamSizes);
    updateWebcamSizes();

    return () => {
      webcamMarkersRef.current.forEach(marker => {
        const interval = (marker as unknown as { _refreshInterval?: number })._refreshInterval;
        if (interval) clearInterval(interval);
      });
      map.current?.off('zoom', updateWebcamSizes);
    };
  }, [webcams, mapLoaded]);

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
