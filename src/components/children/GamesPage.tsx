import { useState } from 'react';
import { Puzzle, Brain, Shapes, Dice6, Zap, Leaf } from 'lucide-react';

export function GamesPage() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [launching, setLaunching] = useState<string | null>(null);

  const launchGame = async (gameId: string) => {
    setLaunching(gameId);
    try {
      const response = await fetch(`http://localhost:5000/api/launch-game/${gameId}`);
      const data = await response.json();
      
      if (data.success) {
        alert(`🎮 ${gameId} game launched!\n\nA new window will open with the game.`);
      } else {
        alert(`Failed to launch game: ${data.error}`);
      }
    } catch (error) {
      alert(`⚠️ Error: Make sure the game server is running.\n\nRun in a terminal:\npython server.py`);
      console.error(error);
    } finally {
      setLaunching(null);
    }
  };

  const games = [
    {
      id: 'bubble-pop',
      title: 'Bubble Pop',
      description: 'Click and pop the bubbles! Avoid the bombs!',
      icon: Zap,
      color: 'from-cyan-400 to-blue-400',
      isPygame: true,
    },
    {
      id: 'zen-sorting',
      title: 'Zen Sorting Garden',
      description: 'Drag stones into bowls of the same color. Calm & relaxing!',
      icon: Leaf,
      color: 'from-green-400 to-emerald-400',
      isPygame: true,
    },
    {
      id: 1,
      title: 'Color Matching',
      description: 'Match colors and learn about different shades!',
      icon: Shapes,
      color: 'from-red-400 to-pink-400',
    },
    {
      id: 2,
      title: 'Puzzle Time',
      description: 'Complete puzzles and improve problem-solving skills!',
      icon: Puzzle,
      color: 'from-blue-400 to-cyan-400',
    },
    {
      id: 3,
      title: 'Memory Game',
      description: 'Test your memory with fun cards!',
      icon: Brain,
      color: 'from-green-400 to-emerald-400',
    },
    {
      id: 4,
      title: 'Shape Sorter',
      description: 'Sort shapes and learn geometry basics!',
      icon: Dice6,
      color: 'from-yellow-400 to-orange-400',
    },
    {
      id: 5,
      title: 'Number Quest',
      description: 'Go on an adventure learning numbers!',
      icon: Brain,
      color: 'from-purple-400 to-pink-400',
    },
    {
      id: 6,
      title: 'Pattern Builder',
      description: 'Create and recognize patterns!',
      icon: Shapes,
      color: 'from-teal-400 to-cyan-400',
    },
  ];

  if (activeGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md text-center">
          <p className="text-6xl mb-6">🎮</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Launched!</h2>
          <p className="text-lg text-gray-600 mb-8">
            The Pygame game is running in a new window. Have fun playing!
          </p>
          <button
            onClick={() => setActiveGame(null)}
            className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform"
          >
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Fun Learning Games!
          </h1>
          <p className="text-xl text-gray-600">
            Pick a game and start learning while having fun!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const Icon = game.icon;
            const isClickable = game.isPygame || typeof game.id === 'string';
            
            return (
              <button
                key={game.id}
                onClick={() => {
                  if (game.isPygame) {
                    launchGame(game.id as string);
                    setActiveGame(game.id as string);
                  }
                }}
                disabled={!isClickable}
                className={`bg-gradient-to-br ${game.color} rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform text-left ${
                  isClickable ? 'cursor-pointer ring-4 ring-white' : 'opacity-75 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white bg-opacity-30 p-4 rounded-2xl">
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white flex-1">
                    {game.title}
                  </h3>
                </div>
                <p className="text-white text-opacity-90 text-lg">
                  {game.description}
                </p>
                <div className="mt-6">
                  <span className="inline-block bg-white bg-opacity-30 text-white px-6 py-2 rounded-full font-semibold">
                    {launching === game.id ? (
                      '🚀 Launching...'
                    ) : game.isPygame ? (
                      'Launch Game 🎮'
                    ) : (
                      'Coming Soon...'
                    )}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-12 bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Your Gaming Stats
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl">
              <p className="text-5xl mb-2">🏆</p>
              <p className="text-3xl font-bold text-orange-600 mb-2">12</p>
              <p className="text-gray-700 font-medium">Games Completed</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
              <p className="text-5xl mb-2">⭐</p>
              <p className="text-3xl font-bold text-purple-600 mb-2">45</p>
              <p className="text-gray-700 font-medium">Stars Earned</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl">
              <p className="text-5xl mb-2">🎯</p>
              <p className="text-3xl font-bold text-teal-600 mb-2">8</p>
              <p className="text-gray-700 font-medium">High Scores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
