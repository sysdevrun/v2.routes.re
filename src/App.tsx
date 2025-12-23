import { useEffect, useState, useCallback } from 'react';
import Map from './components/Map';
import EventsList from './components/EventsList';
import EventDetails from './components/EventDetails';
import { fetchAllEvents, WEBCAMS } from './services/api';
import type { MapEvent } from './types/events';

function App() {
  const [events, setEvents] = useState<MapEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const eventsData = await fetchAllEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();

    // Refresh every 5 minutes
    const interval = setInterval(loadEvents, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEventSelect = useCallback((event: MapEvent | null) => {
    setSelectedEvent(event);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center justify-between shadow-lg z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-blue-500 rounded-lg transition-colors md:hidden"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold">Routes Réunion</h1>
            <p className="text-xs text-blue-200">Événements routiers en temps réel</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-blue-200 hidden sm:inline">
            {events.length} événements
          </span>
          <button
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
            title="Actualiser"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <aside
          className={`absolute md:relative z-10 h-full w-80 bg-white shadow-lg transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden'
          }`}
        >
          <EventsList
            events={events}
            selectedEvent={selectedEvent}
            onEventSelect={handleEventSelect}
            loading={loading}
          />
        </aside>

        {/* Map */}
        <main className="flex-1 relative">
          <Map
            events={events}
            webcams={WEBCAMS}
            selectedEvent={selectedEvent}
            onEventSelect={handleEventSelect}
          />

          {/* Event details popup */}
          {selectedEvent && (
            <EventDetails
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
            />
          )}

          {/* Toggle sidebar button (desktop) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex absolute top-4 left-4 z-10 bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </main>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 z-[5] md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 text-xs py-2 px-4 text-center border-t">
        Données: <a href="https://www.infotrafic.re" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Infotrafic.re</a> |
        Cartographie: © OpenStreetMap contributors
      </footer>
    </div>
  );
}

export default App;
