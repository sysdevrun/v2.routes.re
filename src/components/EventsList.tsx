import type { MapEvent } from '../types/events';

interface EventsListProps {
  events: MapEvent[];
  selectedEvent: MapEvent | null;
  onEventSelect: (event: MapEvent | null) => void;
  loading: boolean;
}

function getEventIcon(type: string): string {
  switch (type) {
    case 'accident':
      return '🚗';
    case 'traffic_jam':
    case 'live_jam':
      return '🚦';
    case 'flood':
      return '🌊';
    case 'roadclosure':
      return '🚧';
    case 'hazard':
    case 'serious_hazard':
    case 'animal':
      return '⚠️';
    case 'market':
      return '🛒';
    case 'local_event':
      return '🎉';
    case 'roadworks':
    case 'work':
      return '🔧';
    case 'trafficolor':
      return '🔴';
    default:
      return '📍';
  }
}

function getEventTypeName(type: string): string {
  switch (type) {
    case 'accident':
      return 'Accident';
    case 'traffic_jam':
    case 'live_jam':
      return 'Embouteillage';
    case 'flood':
      return 'Inondation';
    case 'roadclosure':
      return 'Route fermée';
    case 'hazard':
    case 'serious_hazard':
      return 'Danger';
    case 'animal':
      return 'Animal sur la route';
    case 'market':
      return 'Marché';
    case 'local_event':
      return 'Événement local';
    case 'roadworks':
    case 'work':
      return 'Travaux';
    case 'trafficolor':
      return 'État du trafic';
    default:
      return type;
  }
}

export default function EventsList({
  events,
  selectedEvent,
  onEventSelect,
  loading,
}: EventsListProps) {
  // Group events by type
  const groupedEvents = events.reduce((acc, event) => {
    const key = event.type;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(event);
    return acc;
  }, {} as Record<string, MapEvent[]>);

  // Sort by event count (most events first)
  const sortedGroups = Object.entries(groupedEvents).sort(
    ([, a], [, b]) => b.length - a.length
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          Événements routiers
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {loading ? 'Chargement...' : `${events.length} événement(s)`}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Aucun événement en cours
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedGroups.map(([type, typeEvents]) => (
              <div key={type} className="py-2">
                <div className="px-4 py-2 bg-gray-50 sticky top-0">
                  <span className="text-sm font-medium text-gray-700">
                    {getEventIcon(type)} {getEventTypeName(type)} ({typeEvents.length})
                  </span>
                </div>
                {typeEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onEventSelect(event)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                      selectedEvent?.id === event.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: event.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.title}
                        </p>
                        {event.description && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                        {event.startDate && (
                          <p className="text-xs text-gray-400 mt-1">
                            {event.startDate.toLocaleString('fr-FR', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
