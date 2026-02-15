import { useEffect, useState } from 'react';
import { Plus, Heart, Sparkles, ThumbsUp, BookOpen, X } from 'lucide-react';
import { supabase, Story, Profile } from '../../lib/supabase';

export function StoriesPage() {
  const [stories, setStories] = useState<(Story & { author: Profile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('daily-life');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*, author:profiles(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('stories').insert([
        {
          author_id: user.id,
          title,
          content,
          category,
        },
      ]);

      if (error) throw error;

      setTitle('');
      setContent('');
      setCategory('daily-life');
      setShowCreateModal(false);
      fetchStories();
    } catch (error) {
      console.error('Error creating story:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      'self-care': 'from-green-400 to-teal-400',
      'daily-life': 'from-blue-400 to-cyan-400',
      'achievements': 'from-yellow-400 to-orange-400',
      'challenges': 'from-purple-400 to-pink-400',
      'relationships': 'from-pink-400 to-red-400',
      'work': 'from-indigo-400 to-purple-400',
    };
    return colors[cat] || 'from-gray-400 to-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">Loading stories...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-gray-800 mb-2">
              Community Stories
            </h1>
            <p className="text-xl text-gray-600">
              Share your journey and connect with others
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-teal-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Share Your Story
          </button>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Share Your Story</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateStory} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none"
                    placeholder="Give your story a title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none"
                  >
                    <option value="daily-life">Daily Life</option>
                    <option value="self-care">Self-Care</option>
                    <option value="achievements">Achievements</option>
                    <option value="challenges">Challenges</option>
                    <option value="relationships">Relationships</option>
                    <option value="work">Work</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Story
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={8}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none resize-none"
                    placeholder="Share your thoughts, experiences, and feelings..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-green-400 to-teal-400 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Posting...' : 'Post Story'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {stories.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-2xl text-gray-600 mb-4">
              No stories yet. Be the first to share!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-green-400 to-teal-400 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Share Your Story
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${getCategoryColor(story.category)}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {story.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="font-medium">{story.author.full_name}</span>
                        <span>•</span>
                        <span className="capitalize">{story.category.replace('-', ' ')}</span>
                        <span>•</span>
                        <span>{new Date(story.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`px-4 py-2 bg-gradient-to-r ${getCategoryColor(story.category)} text-white rounded-full text-sm font-semibold capitalize`}>
                      {story.category.replace('-', ' ')}
                    </span>
                  </div>

                  <p className="text-gray-700 text-lg leading-relaxed mb-4 whitespace-pre-wrap">
                    {story.content}
                  </p>

                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <button className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors">
                      <Heart className="w-5 h-5" />
                      <span>Support</span>
                    </button>
                    <button className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium transition-colors">
                      <Sparkles className="w-5 h-5" />
                      <span>Inspiring</span>
                    </button>
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                      <ThumbsUp className="w-5 h-5" />
                      <span>Helpful</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
