import { useEffect, useState } from 'react';
import { Users, Star, MessageCircle, CheckCircle, X } from 'lucide-react';
import { supabase, MentorshipProgram } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function MentorshipPage() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<MentorshipProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<MentorshipProgram | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPrograms();
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('mentorship_programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mentorship_requests')
        .select('program_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const ids = new Set((data || []).map((req) => req.program_id));
      setRequestedIds(ids);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleOpenModal = (program: MentorshipProgram) => {
    setSelectedProgram(program);
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProgram) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('mentorship_requests').insert([
        {
          user_id: user.id,
          program_id: selectedProgram.id,
          message,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      setRequestedIds((prev) => new Set([...prev, selectedProgram.id]));
      setMessage('');
      setShowRequestModal(false);
      setSelectedProgram(null);
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">Loading mentorship programs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Mentorship Programs
          </h1>
          <p className="text-xl text-gray-600">
            Get personalized guidance from experts who understand your journey
          </p>
        </div>

        {showRequestModal && selectedProgram && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Request Mentorship</h2>
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setSelectedProgram(null);
                    setMessage('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {selectedProgram.mentor_name}
                </h3>
                <p className="text-purple-600 font-medium">{selectedProgram.specialty}</p>
              </div>

              <form onSubmit={handleSubmitRequest} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tell the mentor about yourself and your goals
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none resize-none"
                    placeholder="Share what you hope to achieve through this mentorship..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRequestModal(false);
                      setSelectedProgram(null);
                      setMessage('');
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-purple-400 to-pink-400 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {programs.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-2xl text-gray-600">
              No mentorship programs available yet. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {programs.map((program) => {
                const hasRequested = requestedIds.has(program.id);
                return (
                  <div
                    key={program.id}
                    className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                  >
                    <div className="h-2 bg-gradient-to-r from-purple-400 to-pink-400" />
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {program.mentor_name}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <p className="text-lg font-medium text-purple-600">
                              {program.specialty}
                            </p>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-xl">
                          <Users className="w-8 h-8 text-purple-600" />
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {program.description}
                      </p>

                      <div className="mb-4 p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                        <p className="text-sm font-medium text-gray-700">
                          <span className="text-blue-600">Availability:</span> {program.availability}
                        </p>
                      </div>

                      <button
                        onClick={() => handleOpenModal(program)}
                        disabled={hasRequested}
                        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                          hasRequested
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:shadow-lg'
                        }`}
                      >
                        {hasRequested ? (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <MessageCircle className="w-5 h-5" />
                            Request Mentorship
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                What Our Mentors Offer
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                  <Star className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Career Guidance</h3>
                  <p className="text-gray-600">
                    Navigate your professional journey with confidence
                  </p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                  <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Life Skills</h3>
                  <p className="text-gray-600">
                    Develop essential skills for independent living
                  </p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl">
                  <Users className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Personal Growth</h3>
                  <p className="text-gray-600">
                    Achieve your goals and maximize your potential
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
