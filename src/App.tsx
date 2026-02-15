import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { GamesPage } from './components/children/GamesPage';
import { VideosPage } from './components/children/VideosPage';
import { SingAlongsPage } from './components/children/SingAlongsPage';
import { StoriesPage } from './components/adults/StoriesPage';
import { EventsPage } from './components/adults/EventsPage';
import { VolunteeringPage } from './components/adults/VolunteeringPage';
import { MentorshipPage } from './components/adults/MentorshipPage';

function App() {
  const [currentView, setCurrentView] = useState('home');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage setCurrentView={setCurrentView} />;
      case 'games':
        return <GamesPage />;
      case 'videos':
        return <VideosPage />;
      case 'singalongs':
        return <SingAlongsPage />;
      case 'stories':
        return <StoriesPage />;
      case 'events':
        return <EventsPage />;
      case 'volunteering':
        return <VolunteeringPage />;
      case 'mentorship':
        return <MentorshipPage />;
      default:
        return <HomePage setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      {renderView()}
    </div>
  );
}

export default App;
