import { Home, Gamepad2, Video, Music, Heart, Calendar, Users, BookOpen, Briefcase } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function Navigation({ currentView, setCurrentView }: NavigationProps) {
  const childViews = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'singalongs', label: 'Sing-Alongs', icon: Music },
  ];

  const adultViews = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'stories', label: 'Stories', icon: BookOpen },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'volunteering', label: 'Volunteering', icon: Briefcase },
    { id: 'mentorship', label: 'Mentorship', icon: Users },
  ];

  const views = adultViews;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-500" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Autism Hub
              </h1>
              <p className="text-xs text-gray-500">Welcome!</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {views.map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => setCurrentView(view.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    currentView === view.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:inline">{view.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
