import { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Plus, X, CheckCircle } from 'lucide-react';
import { supabase, CommunityEvent, Profile } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<(CommunityEvent & { organizer: Profile; rsvp_count?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('community_events')
        .select('*, organizer:profiles(*)')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });

      if (error) throw error;

      const eventsWithCounts = await Promise.all(
        (data || []).map(async (event) => {
          const { count } = await supabase
            .from('event_rsvps')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id)
            .eq('status', 'going');

          return { ...event, rsvp_count: count || 0 };
        })
      );

      setEvents(eventsWithCounts);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('community_events').insert([
        {
          organizer_id: user.id,
          title,
          description,
          location,
          event_date: eventDate,
        },
      ]);

      if (error) throw error;

      setTitle('');
      setDescription('');
      setLocation('');
      setEventDate('');
      setShowCreateModal(false);
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRSVP = async (eventId: string) => {
    if (!user) return;

    try {
      const { data: existingRSVP } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingRSVP) {
        await supabase
          .from('event_rsvps')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', user.id);
      } else {
        await supabase.from('event_rsvps').insert([
          {
            event_id: eventId,
            user_id: user.id,
            status: 'going',
          },
        ]);
      }

      fetchEvents();
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-gray-800 mb-2">
              Community Events
            </h1>
            <p className="text-xl text-gray-600">
              Find and join local meetups and gatherings
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </button>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Create Community Event</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none"
                    placeholder="Autism Community Meetup"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none"
                    placeholder="City Park, Main Street, NYC"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none resize-none"
                    placeholder="Describe your event..."
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
                    className="flex-1 bg-gradient-to-r from-orange-400 to-red-400 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Creating...' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {events.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-2xl text-gray-600 mb-4">
              No upcoming events. Create one to get started!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Create Event
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="h-2 bg-gradient-to-r from-orange-400 to-red-400" />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {event.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5 text-orange-500" />
                      <span className="font-medium">
                        {new Date(event.event_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <span>{event.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-5 h-5 text-blue-500" />
                      <span>{event.rsvp_count} people going</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      By {event.organizer.full_name}
                    </p>
                    <button
                      onClick={() => handleRSVP(event.id)}
                      className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-400 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <CheckCircle className="w-5 h-5" />
                      RSVP
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
