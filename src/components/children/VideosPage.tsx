import { useEffect, useState } from 'react';
import { Play, CheckCircle2 } from 'lucide-react';
import { supabase, VideoSession } from '../../lib/supabase';

export function VideosPage() {
  const [videos, setVideos] = useState<VideoSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoSession | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('video_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      communication: 'from-blue-400 to-cyan-400',
      sensory: 'from-purple-400 to-pink-400',
      emotional: 'from-green-400 to-teal-400',
      social: 'from-yellow-400 to-orange-400',
    };
    return colors[category] || 'from-gray-400 to-gray-500';
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      communication: '💬',
      sensory: '👂',
      emotional: '❤️',
      social: '🤝',
    };
    return emojis[category] || '📚';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 p-6 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">Loading videos...</div>
      </div>
    );
  }

  if (selectedVideo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 p-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setSelectedVideo(null)}
            className="mb-6 px-6 py-3 bg-white rounded-xl shadow-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
          >
            ← Back to Videos
          </button>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <Play className="w-24 h-24 text-white opacity-50" />
              <p className="text-white text-xl ml-4">Video Player Placeholder</p>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{getCategoryEmoji(selectedVideo.category)}</span>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">{selectedVideo.title}</h2>
                  <p className="text-gray-600 capitalize">{selectedVideo.category} Skills</p>
                </div>
              </div>

              <p className="text-lg text-gray-700 mb-6">{selectedVideo.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
                  {selectedVideo.duration_minutes} minutes
                </span>
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold capitalize">
                  {selectedVideo.category}
                </span>
              </div>

              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Take a Quiz!</h3>
                <p className="text-gray-700 mb-4">
                  Test what you've learned from this video!
                </p>
                <button className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Learning Videos!
          </h1>
          <p className="text-xl text-gray-600">
            Watch fun videos and learn new skills!
          </p>
        </div>

        {videos.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <p className="text-2xl text-gray-600">
              No videos available yet. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`bg-gradient-to-br ${getCategoryColor(video.category)} rounded-3xl p-6 shadow-2xl hover:scale-105 transition-transform text-left`}
                >
                  <div className="aspect-video bg-white bg-opacity-30 rounded-2xl flex items-center justify-center mb-4">
                    <Play className="w-16 h-16 text-white" />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">{getCategoryEmoji(video.category)}</span>
                    <h3 className="text-xl font-bold text-white flex-1">
                      {video.title}
                    </h3>
                  </div>

                  <p className="text-white text-opacity-90 mb-4 line-clamp-2">
                    {video.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-white text-opacity-90 font-semibold">
                      {video.duration_minutes} min
                    </span>
                    <span className="bg-white bg-opacity-30 text-white px-4 py-1 rounded-full text-sm font-semibold capitalize">
                      {video.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-12 bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Your Learning Progress
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl">
                  <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-blue-600 mb-2">8</p>
                  <p className="text-gray-700 font-medium">Videos Watched</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl">
                  <p className="text-5xl mb-2">🎓</p>
                  <p className="text-3xl font-bold text-green-600 mb-2">6</p>
                  <p className="text-gray-700 font-medium">Quizzes Completed</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
                  <p className="text-5xl mb-2">⭐</p>
                  <p className="text-3xl font-bold text-purple-600 mb-2">92%</p>
                  <p className="text-gray-700 font-medium">Average Score</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
