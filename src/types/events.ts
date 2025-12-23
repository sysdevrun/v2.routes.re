export interface LocalizedText {
  en?: string;
  fr?: string;
}

export interface RoadDisruption {
  unique_disruption_number?: string;
  geolocation: [number, number] | [number, number][];
  address?: string;
  severity_level?: number;
  actual_start_date?: string;
  planned_start_date?: string;
  actual_end_date?: string;
  planned_end_date?: string;
  public_description?: LocalizedText | string;
  short_description?: LocalizedText | string;
  detailed_description?: LocalizedText | string;
  direction?: string;
  picture?: string | string[];
  source?: string;
  visibility?: 'yes' | 'no';
  disruption_type?: string;
  trafficolor?: string;
  options?: {
    trafficolor?: string;
  };
}

export interface RoadDisruptionsResponse {
  [id: string]: RoadDisruption;
}

export interface RoadWork {
  id: string | number;
  geolocation: [number, number] | [number, number][];
  address?: string;
  direction?: string;
  type?: string;
  severity?: number;
  'Short message'?: string;
  'Private message'?: string;
  photo?: string | null;
  'start date'?: string;
  'end date and hour'?: string;
  source?: string;
  updated?: string;
}

export type DisruptionType =
  | 'trafficolor'
  | 'accident'
  | 'traffic_jam'
  | 'live_jam'
  | 'flood'
  | 'roadclosure'
  | 'hazard'
  | 'serious_hazard'
  | 'animal'
  | 'market'
  | 'local_event'
  | 'roadworks';

export interface MapEvent {
  id: string;
  type: DisruptionType | 'work';
  coordinates: [number, number];
  title: string;
  description?: string;
  severity?: number;
  color?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface Webcam {
  id: string;
  url: string;
  coordinates: [number, number];
  description: string;
}
