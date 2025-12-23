import type { RoadDisruptionsResponse, RoadWork, DisruptionType, MapEvent, LocalizedText, Webcam } from '../types/events';

const PROXY_BASE = 'https://gtfs-proxy.sys-dev-run.re/proxy/';
const API_HOST = 'www.infotrafic.re';

function proxyUrl(path: string): string {
  return `${PROXY_BASE}${API_HOST}${path}`;
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
    const response = await fetch(proxyUrl(`/api/road/disruptions/${type}`));
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
    const response = await fetch(proxyUrl('/api/road/works'));
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

interface WebcamResponse {
  [id: string]: {
    webcam_id: string;
    url: string;
    geolocation: [number, number];
    public_description?: string;
  };
}

export async function fetchWebcams(): Promise<Webcam[]> {
  try {
    const response = await fetch(proxyUrl('/api/road/info/webcam'));
    if (!response.ok) {
      console.warn('Failed to fetch webcams:', response.status);
      return [];
    }

    const data: WebcamResponse = await response.json();
    const webcams: Webcam[] = [];

    for (const [id, webcam] of Object.entries(data)) {
      const [lng, lat] = webcam.geolocation;
      if (!isFinite(lng) || !isFinite(lat)) continue;

      webcams.push({
        id: webcam.webcam_id || id,
        url: webcam.url,
        coordinates: [lng, lat],
        description: webcam.public_description || '',
      });
    }

    return webcams;
  } catch (error) {
    console.warn('Error fetching webcams:', error);
    return [];
  }
}
