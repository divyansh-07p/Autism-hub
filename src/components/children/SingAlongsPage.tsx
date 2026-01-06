import { Music, Play, Heart } from 'lucide-react';
import { useState } from 'react';

export function SingAlongsPage() {
  const [playingSong, setPlayingSong] = useState<number | null>(null);

  const songs = [
    {
      id: 1,
      title: 'Hello Song',
      description: 'Start your day with a friendly greeting!',
      color: 'from-yellow-400 to-orange-400',
      emoji: '👋',
    },
    {
      id: 2,
      title: 'Colors of the Rainbow',
      description: 'Learn all the beautiful colors!',
      color: 'from-red-400 via-yellow-400 to-blue-400',
      emoji: '🌈',
    },
    {
      id: 3,
      title: 'Feelings Song',
      description: 'Express how you feel today!',
      color: 'from-pink-400 to-purple-400',
      emoji: '😊',
    },
    {
      id: 4,
      title: 'ABC Adventure',
      description: 'Sing along with the alphabet!',
      color: 'from-green-400 to-teal-400',
      emoji: '🔤',
    },
    {
      id: 5,
      title: 'Number Dance',
      description: 'Count and dance from 1 to 10!',
      color: 'from-blue-400 to-cyan-400',
      emoji: '🔢',
    },
    {
      id: 6,
      title: 'Animal Sounds',
      description: 'Make sounds like different animals!',
      color: 'from-orange-400 to-red-400',
      emoji: '🐾',
    },
    {
      id: 7,
      title: 'Friendship Song',
      description: 'Celebrate friends and togetherness!',
      color: 'from-purple-400 to-pink-400',
      emoji: '🤝',
    },
    {
      id: 8,
      title: 'Clean Up Time',
      description: 'Make tidying up fun!',
      color: 'from-teal-400 to-green-400',
      emoji: '🧹',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="w-16 h-16 text-purple-500" />
            <h1 className="text-5xl font-bold text-gray-800">
              Sing-Along Time!
            </h1>
            <Music className="w-16 h-16 text-pink-500" />
          </div>
          <p className="text-xl text-gray-600">
            Pick a song and sing along with the music!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {songs.map((song) => (
            <button
              key={song.id}
              onClick={() => setPlayingSong(song.id)}
              className={`bg-gradient-to-br ${song.color} rounded-3xl p-6 shadow-2xl hover:scale-105 transition-transform relative`}
            >
              {playingSong === song.id && (
                <div className="absolute top-4 right-4 bg-white rounded-full p-2 animate-pulse">
                  <Music className="w-6 h-6 text-purple-600" />
                </div>
              )}

              <div className="text-6xl mb-4 text-center">{song.emoji}</div>

              <h3 className="text-xl font-bold text-white mb-2 text-center">
                {song.title}
              </h3>

              <p className="text-white text-opacity-90 text-sm text-center mb-4">
                {song.description}
              </p>

              <div className="flex justify-center">
                <span className="inline-flex items-center gap-2 bg-white bg-opacity-30 text-white px-4 py-2 rounded-full font-semibold">
                  <Play className="w-4 h-4" />
                  {playingSong === song.id ? 'Playing...' : 'Play'}
                </span>
              </div>
            </button>
          ))}
        </div>

        {playingSong && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Now Playing: {songs.find((s) => s.id === playingSong)?.title}
              </h2>
              <p className="text-gray-600">
                {songs.find((s) => s.id === playingSong)?.description}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Music className="w-12 h-12 text-purple-600 animate-bounce" />
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-16 bg-purple-400 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <Music className="w-12 h-12 text-pink-600 animate-bounce" />
              </div>
              <p className="text-center text-gray-700 text-lg">
                Music playing... Sing along! 🎵
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button className="bg-gradient-to-r from-red-400 to-pink-400 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                Stop
              </button>
              <button className="bg-gradient-to-r from-purple-400 to-blue-400 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                Next Song
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Your Singing Stats
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl">
              <Heart className="w-12 h-12 text-pink-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-pink-600 mb-2">15</p>
              <p className="text-gray-700 font-medium">Songs Sung</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl">
              <p className="text-5xl mb-2">🎤</p>
              <p className="text-3xl font-bold text-orange-600 mb-2">8</p>
              <p className="text-gray-700 font-medium">Favorites</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl">
              <p className="text-5xl mb-2">⏱️</p>
              <p className="text-3xl font-bold text-blue-600 mb-2">45</p>
              <p className="text-gray-700 font-medium">Minutes Singing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
