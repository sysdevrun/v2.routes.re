import type { MapEvent, Webcam } from '../types/events';

// Fake events for testing
const FAKE_EVENTS: MapEvent[] = [
  {
    id: 'accident-1',
    type: 'accident',
    coordinates: [55.39, -20.89], // Inside Route du Littoral
    title: 'Accident - Collision entre 2 véhicules',
    description: 'RN1 Route du Littoral, direction Saint-Denis. Circulation ralentie.',
    severity: 3,
    color: '#DC2626',
    startDate: new Date(),
  },
  {
    id: 'roadclosure-1',
    type: 'roadclosure',
    coordinates: [55.47, -21.20], // Inside Route de Cilaos
    title: 'Route fermée - Éboulement',
    description: 'RN5 Route de Cilaos fermée suite à un éboulement. Déviation en place.',
    severity: 4,
    color: '#7C3AED',
    startDate: new Date(),
  },
];

export async function fetchAllEvents(): Promise<MapEvent[]> {
  // Return fake events for testing
  return Promise.resolve(FAKE_EVENTS);
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
