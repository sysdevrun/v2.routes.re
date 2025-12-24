import type { RoadDisruptionsResponse, RoadWork, DisruptionType, MapEvent, LocalizedText, Webcam } from '../types/events';

const API_BASE = 'https://www.infotrafic.re';

function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

function getLocalizedText(text: LocalizedText | string | undefined): string {
  if (!text || text === 'nil') return '';
  if (typeof text === 'string') return text;
  return text.fr || text.en || '';
}

function parseCoordinates(geolocation: [number, number] | [number, number][]): [number, number] | null {
  if (!geolocation || !Array.isArray(geolocation)) return null;

  // Single point: [lng, lat]
  if (typeof geolocation[0] === 'number') {
    const [lng, lat] = geolocation as [number, number];
    if (isFinite(lng) && isFinite(lat)) {
      return [lng, lat];
    }
    return null;
  }

  // Array of points: [[lng, lat], ...] - take first point
  const points = geolocation as [number, number][];
  if (points.length > 0 && Array.isArray(points[0])) {
    const [lng, lat] = points[0];
    if (isFinite(lng) && isFinite(lat)) {
      return [lng, lat];
    }
  }

  return null;
}

function getEventColor(type: DisruptionType | 'work', severity?: number, trafficolor?: string): string {
  if (trafficolor) {
    return trafficolor;
  }

  switch (type) {
    case 'accident':
      return '#DC2626'; // red-600
    case 'traffic_jam':
    case 'live_jam':
      return '#EA580C'; // orange-600
    case 'flood':
      return '#2563EB'; // blue-600
    case 'roadclosure':
      return '#7C3AED'; // violet-600
    case 'hazard':
    case 'serious_hazard':
    case 'animal':
      return '#CA8A04'; // yellow-600
    case 'market':
    case 'local_event':
      return '#0891B2'; // cyan-600
    case 'roadworks':
    case 'work':
      return '#D97706'; // amber-600
    case 'trafficolor':
      if (severity && severity >= 3) return '#EA412C';
      if (severity && severity >= 2) return '#EE7E33';
      return '#77F362';
    default:
      return '#6B7280'; // gray-500
  }
}

export async function fetchDisruptions(type: DisruptionType): Promise<MapEvent[]> {
  try {
    const response = await fetch(apiUrl(`/api/road/disruptions/${type}`));
    if (!response.ok) {
      console.warn(`Failed to fetch ${type}:`, response.status);
      return [];
    }

    const data: RoadDisruptionsResponse = await response.json();
    const events: MapEvent[] = [];

    for (const [id, disruption] of Object.entries(data)) {
      if (disruption.visibility === 'no') continue;

      const coords = parseCoordinates(disruption.geolocation);
      if (!coords) continue;

      const trafficolor = disruption.trafficolor || disruption.options?.trafficolor;

      events.push({
        id: `${type}-${id}`,
        type,
        coordinates: coords,
        title: getLocalizedText(disruption.short_description) ||
               getLocalizedText(disruption.public_description) ||
               disruption.unique_disruption_number ||
               type,
        description: getLocalizedText(disruption.detailed_description) ||
                    getLocalizedText(disruption.public_description) ||
                    disruption.address,
        severity: disruption.severity_level,
        color: getEventColor(type, disruption.severity_level, trafficolor),
        startDate: disruption.actual_start_date ? new Date(disruption.actual_start_date) : undefined,
        endDate: disruption.actual_end_date ? new Date(disruption.actual_end_date) : undefined,
      });
    }

    return events;
  } catch (error) {
    console.warn(`Error fetching ${type}:`, error);
    return [];
  }
}

export async function fetchRoadWorks(): Promise<MapEvent[]> {
  try {
    const response = await fetch(apiUrl('/api/road/works'));
    if (!response.ok) {
      console.warn('Failed to fetch road works:', response.status);
      return [];
    }

    const data: RoadWork[] = await response.json();
    if (!Array.isArray(data)) return [];

    const events: MapEvent[] = [];

    for (const work of data) {
      const coords = parseCoordinates(work.geolocation);
      if (!coords) continue;

      events.push({
        id: `work-${work.id}`,
        type: 'work',
        coordinates: coords,
        title: work['Short message'] || work.type || 'Travaux',
        description: work.address || work['Private message'],
        severity: work.severity,
        color: getEventColor('work', work.severity),
        startDate: work['start date'] ? new Date(work['start date']) : undefined,
        endDate: work['end date and hour'] ? new Date(work['end date and hour']) : undefined,
      });
    }

    return events;
  } catch (error) {
    console.warn('Error fetching road works:', error);
    return [];
  }
}

const DISRUPTION_TYPES: DisruptionType[] = [
  'trafficolor',
  'accident',
  'traffic_jam',
  'flood',
  'roadclosure',
  'hazard',
  'market',
  'local_event',
  'roadworks',
];

export async function fetchAllEvents(): Promise<MapEvent[]> {
  const results = await Promise.all([
    ...DISRUPTION_TYPES.map(type => fetchDisruptions(type)),
    fetchRoadWorks(),
  ]);

  return results.flat();
}

export const WEBCAMS: Webcam[] = [
  { id: 'dec_02', url: 'https://www.infotrafic.re/CAM/dec_02.jpeg', coordinates: [55.31209621977827, -20.955382789540305], description: 'RN1 Le Port, Echangeur Sacré Coeur' },
  { id: 'dec_04', url: 'https://www.infotrafic.re/CAM/dec_04.jpeg', coordinates: [55.51553566201191, -20.89733044256631], description: 'RN2 Ste Marie, Duparc' },
  { id: 'dec_05', url: 'https://www.infotrafic.re/CAM/dec_05.jpeg', coordinates: [55.540658473383616, -21.364254003050302], description: 'RN2 Ste Pierre, Anse Les Bas' },
  { id: 'dec_09', url: 'https://www.infotrafic.re/CAM/dec_09.jpeg', coordinates: [55.267729819984524, -21.015287619565377], description: 'RN1 St Paul, Tranchée St Paul' },
  { id: 'dec_10', url: 'https://www.infotrafic.re/CAM/dec_10.jpeg', coordinates: [55.270266029361096, -21.103505473204294], description: 'RN1 ravine 3 Bassins' },
  { id: 'dec_11', url: 'https://www.infotrafic.re/CAM/dec_11.jpeg', coordinates: [55.2973737814865, -21.1623332799991], description: 'RN1 St Leu, ravine Fontaine' },
  { id: 'dec_12', url: 'https://www.infotrafic.re/CAM/dec_12.jpeg', coordinates: [55.42974422285536, -21.306340922876032], description: 'RN1 St Pierre, Pierrefond' },
  { id: 'dec_13', url: 'https://www.infotrafic.re/CAM/dec_13.jpeg', coordinates: [55.51238606086032, -21.292684655124727], description: 'RN3 St Pierre, Azalée' },
  { id: 'dec_14', url: 'https://www.infotrafic.re/CAM/dec_14.jpeg', coordinates: [55.41810025943514, -20.875716767926626], description: 'RN1 St Denis, Potences' },
  { id: 'dec_15', url: 'https://www.infotrafic.re/CAM/dec_15.jpeg', coordinates: [55.37235261274812, -20.89760007444679], description: 'RN1 Possession, Grande Chaloupe' },
  { id: 'dec_16', url: 'https://www.infotrafic.re/CAM/dec_16.jpeg', coordinates: [55.27377396447137, -21.01240180994842], description: 'RN1 St Paul, Echangeur Bellemène' },
  { id: 'dec_17', url: 'https://www.infotrafic.re/CAM/dec_17.jpeg', coordinates: [55.255757228628156, -21.024369567422823], description: 'RN1 St Paul, Echangeur Plateau Caillou' },
  { id: 'dec_18', url: 'https://www.infotrafic.re/CAM/dec_18.jpeg', coordinates: [55.2494328349403, -21.04161287677858], description: 'RN1 St Paul, Echangeur Eperon' },
];
