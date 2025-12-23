import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from 'pmtiles';
import { layers, namedFlavor } from '@protomaps/basemaps';
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
        glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
        sprite: 'https://protomaps.github.io/basemaps-assets/sprites/v4/light',
        sources: {
          protomaps: {
            type: 'vector',
            url: PMTILES_VECTOR,
            attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
          },
        },
        layers: layers('protomaps', namedFlavor('light'), { lang: 'fr' }),
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
