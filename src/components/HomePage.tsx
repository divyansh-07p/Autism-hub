import { Sparkles, Star, Rocket, Heart } from 'lucide-react';

interface HomePageProps {
  setCurrentView: (view: string) => void;
  userMode: 'kids' | 'adult';
}

export function HomePage({ setCurrentView, userMode }: HomePageProps) {
  if (userMode === 'kids') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Welcome to Your Fun Learning Space!
            </h1>
            <p className="text-xl text-gray-600">
              Let's play, learn, and grow together!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => setCurrentView('games')}
              className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform"
            >
              <div className="flex justify-center mb-4">
                <Rocket className="w-20 h-20 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Fun Games
              </h3>
              <p className="text-white text-opacity-90">
                Play educational games and puzzles!
              </p>
            </button>

            <button
              onClick={() => setCurrentView('videos')}
              className="bg-gradient-to-br from-blue-400 to-purple-400 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform"
            >
              <div className="flex justify-center mb-4">
                <Star className="w-20 h-20 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Learning Videos
              </h3>
              <p className="text-white text-opacity-90">
                Watch fun videos and take quizzes!
              </p>
            </button>

            <button
              onClick={() => setCurrentView('singalongs')}
              className="bg-gradient-to-br from-pink-400 to-red-400 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform"
            >
              <div className="flex justify-center mb-4">
                <Sparkles className="w-20 h-20 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Sing-Alongs
              </h3>
              <p className="text-white text-opacity-90">
                Sing and dance with fun songs!
              </p>
            </button>
          </div>

          <div className="mt-12 bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Your Progress
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-yellow-50 rounded-2xl">
                <p className="text-4xl font-bold text-yellow-600 mb-2">12</p>
                <p className="text-gray-600 font-medium">Games Played</p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-2xl">
                <p className="text-4xl font-bold text-blue-600 mb-2">8</p>
                <p className="text-gray-600 font-medium">Videos Watched</p>
              </div>
              <div className="text-center p-6 bg-pink-50 rounded-2xl">
                <p className="text-4xl font-bold text-pink-600 mb-2">15</p>
                <p className="text-gray-600 font-medium">Songs Sung</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to Your Community
          </h1>
          <p className="text-xl text-gray-600">
            Connect, share, and grow with others who understand
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setCurrentView('stories')}
            className="bg-gradient-to-br from-green-400 to-teal-400 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform text-left"
          >
            <Heart className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Share Your Story
            </h3>
            <p className="text-white text-opacity-90">
              Connect with others by sharing your experiences, ideas, and feelings
            </p>
          </button>

          <button
            onClick={() => setCurrentView('events')}
            className="bg-gradient-to-br from-orange-400 to-red-400 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform text-left"
          >
            <Star className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Community Events
            </h3>
            <p className="text-white text-opacity-90">
              Find and RSVP to local meetups and community gatherings
            </p>
          </button>

          <button
            onClick={() => setCurrentView('volunteering')}
            className="bg-gradient-to-br from-blue-400 to-indigo-400 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform text-left"
          >
            <Rocket className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Volunteering
            </h3>
            <p className="text-white text-opacity-90">
              Make a difference in your community through volunteering
            </p>
          </button>

          <button
            onClick={() => setCurrentView('mentorship')}
            className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform text-left"
          >
            <Sparkles className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Mentorship
            </h3>
            <p className="text-white text-opacity-90">
              Get guidance from experts in career, life skills, and personal growth
            </p>
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Quick Stats
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-2xl">
              <p className="text-3xl font-bold text-green-600 mb-2">3</p>
              <p className="text-gray-600 font-medium">Stories Shared</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-2xl">
              <p className="text-3xl font-bold text-orange-600 mb-2">5</p>
              <p className="text-gray-600 font-medium">Events RSVPed</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-2xl">
              <p className="text-3xl font-bold text-blue-600 mb-2">2</p>
              <p className="text-gray-600 font-medium">Applications</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-2xl">
              <p className="text-3xl font-bold text-purple-600 mb-2">1</p>
              <p className="text-gray-600 font-medium">Mentorship</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
