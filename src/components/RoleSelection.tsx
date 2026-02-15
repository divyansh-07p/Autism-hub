export function RoleSelection({ onSelectRole }: { onSelectRole: (role: 'child' | 'adult') => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Autism Hub</h1>
        <p className="text-xl text-gray-700 mb-12">Welcome to our inclusive community</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
          {/* Child Section */}
          <button
            onClick={() => onSelectRole('child')}
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition transform hover:scale-105 cursor-pointer"
          >
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-3xl font-bold text-blue-600 mb-3">For Kids</h2>
            <p className="text-gray-600 mb-6">
              Play games, watch videos, and have fun with sing-alongs
            </p>
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700 mb-4">
              <p className="font-semibold mb-2">✨ Features:</p>
              <ul className="text-left space-y-1">
                <li>🎯 Interactive Games</li>
                <li>🎵 Sing Along Videos</li>
                <li>📚 Educational Content</li>
              </ul>
            </div>
            <span className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold">
              Enter →
            </span>
          </button>

          {/* Adult Section */}
          <button
            onClick={() => onSelectRole('adult')}
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition transform hover:scale-105 cursor-pointer"
          >
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-3xl font-bold text-purple-600 mb-3">For Adults</h2>
            <p className="text-gray-600 mb-6">
              Connect for mentorship, volunteering, and community support
            </p>
            <div className="bg-purple-50 rounded-lg p-4 text-sm text-gray-700 mb-4">
              <p className="font-semibold mb-2">✨ Features:</p>
              <ul className="text-left space-y-1">
                <li>🤝 Mentorship Program</li>
                <li>💙 Volunteering Opportunities</li>
                <li>📖 Community Stories</li>
                <li>🎪 Events & Meetups</li>
              </ul>
            </div>
            <span className="inline-block bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold">
              Enter →
            </span>
          </button>
        </div>

        <p className="mt-12 text-gray-600 text-sm">
          Choose your section to get started
        </p>
      </div>
    </div>
  );
}
