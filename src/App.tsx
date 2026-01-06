import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { WelcomeLanding } from './components/WelcomeLanding';
import { HomePage } from './components/HomePage';
import { GamesPage } from './components/children/GamesPage';
import { VideosPage } from './components/children/VideosPage';
import { SingAlongsPage } from './components/children/SingAlongsPage';
import { StoriesPage } from './components/adults/StoriesPage';
import { EventsPage } from './components/adults/EventsPage';
import { VolunteeringPage } from './components/adults/VolunteeringPage';
import { MentorshipPage } from './components/adults/MentorshipPage';

function AppContent() {
  const [userMode, setUserMode] = useState<'kids' | 'adult' | null>(null);
  const [currentView, setCurrentView] = useState('home');

  const handleModeSelect = (mode: 'kids' | 'adult') => {
    setUserMode(mode);
    setCurrentView('home');
  };

  const handleBackToMode = () => {
    setUserMode(null);
    setCurrentView('home');
  };

  if (userMode === null) {
    return <WelcomeLanding onSelectMode={handleModeSelect} />;
  }

  const renderView = () => {
    if (userMode === 'kids') {
      switch (currentView) {
        case 'home':
          return <HomePage setCurrentView={setCurrentView} userMode="kids" />;
        case 'games':
          return <GamesPage />;
        case 'videos':
          return <VideosPage />;
        case 'singalongs':
          return <SingAlongsPage />;
        default:
          return <HomePage setCurrentView={setCurrentView} userMode="kids" />;
      }
    } else {
      switch (currentView) {
        case 'home':
          return <HomePage setCurrentView={setCurrentView} userMode="adult" />;
        case 'stories':
          return <StoriesPage />;
        case 'events':
          return <EventsPage />;
        case 'volunteering':
          return <VolunteeringPage />;
        case 'mentorship':
          return <MentorshipPage />;
        default:
          return <HomePage setCurrentView={setCurrentView} userMode="adult" />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        userMode={userMode}
        onBackToMode={handleBackToMode}
      />
      {renderView()}
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
