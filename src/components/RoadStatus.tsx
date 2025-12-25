import { useMemo } from 'react';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import { REUNION_ROUTES } from '../data/reunionRoutes';
import type { MapEvent } from '../types/events';

interface RoadStatusProps {
  events: MapEvent[];
}

interface RouteStatus {
  name: string;
  events: MapEvent[];
  hasIncident: boolean;
  severity: 'normal' | 'warning' | 'danger';
}

function getRouteSeverity(events: MapEvent[]): 'normal' | 'warning' | 'danger' {
  if (events.length === 0) return 'normal';

  const hasDanger = events.some(e =>
    e.type === 'accident' ||
    e.type === 'roadclosure' ||
    e.type === 'flood'
  );
  if (hasDanger) return 'danger';

  return 'warning';
}

function getSeverityStyles(severity: 'normal' | 'warning' | 'danger'): string {
  switch (severity) {
    case 'danger':
      return 'bg-red-100 border-red-500 text-red-800';
    case 'warning':
      return 'bg-amber-100 border-amber-500 text-amber-800';
    default:
      return 'bg-green-100 border-green-500 text-green-800';
  }
}

export default function RoadStatus({ events }: RoadStatusProps) {
  const routeStatuses = useMemo<RouteStatus[]>(() => {
    return REUNION_ROUTES.features.map(feature => {
      const routeName = feature.properties?.name || 'Unknown Route';

      // Find events within this route's polygon
      const routeEvents = events.filter(event => {
        const eventPoint = point(event.coordinates);
        return booleanPointInPolygon(eventPoint, feature);
      });

      return {
        name: routeName,
        events: routeEvents,
        hasIncident: routeEvents.length > 0,
        severity: getRouteSeverity(routeEvents),
      };
    });
  }, [events]);

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap gap-3">
          {routeStatuses.map(route => (
            <div
              key={route.name}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${getSeverityStyles(route.severity)}`}
            >
              <div className="font-semibold text-sm">{route.name}</div>
              {route.events.length > 0 && (
                <div className="text-xs mt-1 max-w-48">
                  {route.events.map(event => (
                    <div key={event.id} className="truncate">
                      {event.title}
                    </div>
                  ))}
                </div>
              )}
              {route.events.length === 0 && (
                <div className="text-xs mt-1 opacity-70">Trafic fluide</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
