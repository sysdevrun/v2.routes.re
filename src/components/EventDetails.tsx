import type { MapEvent } from '../types/events';

interface EventDetailsProps {
  event: MapEvent;
  onClose: () => void;
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

export default function EventDetails({ event, onClose }: EventDetailsProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-xl z-10 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: event.color }}
            />
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {getEventTypeName(event.type)}
              </span>
              <h3 className="text-lg font-semibold text-gray-900 mt-0.5">
                {event.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {event.description && (
          <p className="mt-3 text-sm text-gray-600">{event.description}</p>
        )}

        <div className="mt-4 space-y-2 text-sm">
          {event.startDate && (
            <div className="flex items-center gap-2 text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                Début:{' '}
                {event.startDate.toLocaleString('fr-FR', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>
          )}
          {event.endDate && (
            <div className="flex items-center gap-2 text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Fin:{' '}
                {event.endDate.toLocaleString('fr-FR', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>
              {event.coordinates[1].toFixed(5)}, {event.coordinates[0].toFixed(5)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
