import { Heart, Sparkles, Users } from 'lucide-react';

interface WelcomeLandingProps {
  onSelectMode: (mode: 'kids' | 'adult') => void;
}

export function WelcomeLanding({ onSelectMode }: WelcomeLandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Heart className="w-12 h-12 text-pink-500" />
            <Sparkles className="w-12 h-12 text-yellow-500" />
            <Users className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Autism Community Hub
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            A safe, inclusive space for learning and connection
          </p>
          <p className="text-lg text-gray-500">
            Choose your experience below
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Kids Section */}
          <button
            onClick={() => onSelectMode('kids')}
            className="group relative bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-400 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="text-6xl">🎮</div>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                For Kids
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Fun games, videos, and sing-alongs designed just for you!
              </p>
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                <span className="bg-yellow-300 text-gray-800 px-4 py-2 rounded-full font-semibold">
                  🎮 Games
                </span>
                <span className="bg-pink-300 text-gray-800 px-4 py-2 rounded-full font-semibold">
                  🎵 Sing-Alongs
                </span>
                <span className="bg-blue-300 text-gray-800 px-4 py-2 rounded-full font-semibold">
                  🎬 Videos
                </span>
              </div>
              <div className="bg-white bg-opacity-70 rounded-2xl p-4 text-sm text-gray-700">
                <p className="font-semibold mb-2">What's Waiting:</p>
                <ul className="space-y-1 text-left">
                  <li>✨ Educational games & puzzles</li>
                  <li>🎬 Fun learning videos</li>
                  <li>🎵 Interactive sing-alongs</li>
                </ul>
              </div>
            </div>
          </button>

          {/* Adult Section */}
          <button
            onClick={() => onSelectMode('adult')}
            className="group relative bg-gradient-to-br from-green-200 via-teal-200 to-purple-200 rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-teal-400 to-purple-400 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="text-6xl">👥</div>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                For Adults
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Connect, share, and grow with our supportive community!
              </p>
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                <span className="bg-green-300 text-gray-800 px-4 py-2 rounded-full font-semibold">
                  📖 Stories
                </span>
                <span className="bg-teal-300 text-gray-800 px-4 py-2 rounded-full font-semibold">
                  🤝 Volunteering
                </span>
                <span className="bg-purple-300 text-gray-800 px-4 py-2 rounded-full font-semibold">
                  👨‍🏫 Mentorship
                </span>
              </div>
              <div className="bg-white bg-opacity-70 rounded-2xl p-4 text-sm text-gray-700">
                <p className="font-semibold mb-2">What's Waiting:</p>
                <ul className="space-y-1 text-left">
                  <li>📖 Share & read community stories</li>
                  <li>🎉 Discover local events & meetups</li>
                  <li>👨‍🏫 Mentorship & volunteering opportunities</li>
                </ul>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            💙 A safe space for everyone in the autism community
          </p>
        </div>
      </div>
    </div>
  );
}
