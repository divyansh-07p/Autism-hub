import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { GamesPage } from './components/children/GamesPage';
import { VideosPage } from './components/children/VideosPage';
import { SingAlongsPage } from './components/children/SingAlongsPage';
import { StoriesPage } from './components/adults/StoriesPage';
import { EventsPage } from './components/adults/EventsPage';
import { VolunteeringPage } from './components/adults/VolunteeringPage';
import { MentorshipPage } from './components/adults/MentorshipPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-3xl font-bold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
