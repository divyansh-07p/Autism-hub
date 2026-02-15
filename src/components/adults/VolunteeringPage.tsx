import { useEffect, useState } from 'react';
import { Briefcase, MapPin, Mail, Heart, CheckCircle } from 'lucide-react';
import { supabase, VolunteeringOpportunity } from '../../lib/supabase';

export function VolunteeringPage() {
  const [opportunities, setOpportunities] = useState<VolunteeringOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOpportunities();
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('volunteering_opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('volunteering_applications')
        .select('opportunity_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const ids = new Set((data || []).map((app) => app.opportunity_id));
      setAppliedIds(ids);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleApply = async (opportunityId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('volunteering_applications').insert([
        {
          user_id: user.id,
          opportunity_id: opportunityId,
          message: 'I would like to volunteer for this opportunity!',
          status: 'pending',
        },
      ]);

      if (error) throw error;

      setAppliedIds((prev) => new Set([...prev, opportunityId]));
    } catch (error) {
      console.error('Error applying:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">Loading opportunities...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Volunteering Opportunities
          </h1>
          <p className="text-xl text-gray-600">
            Make a difference in your community
          </p>
        </div>

        {opportunities.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <Briefcase className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-2xl text-gray-600">
              No volunteering opportunities available yet. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {opportunities.map((opportunity) => {
                const hasApplied = appliedIds.has(opportunity.id);
                return (
                  <div
                    key={opportunity.id}
                    className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                  >
                    <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-400" />
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {opportunity.title}
                          </h3>
                          <p className="text-lg font-medium text-blue-600 mb-3">
                            {opportunity.organization}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl">
                          <Briefcase className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {opportunity.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-5 h-5 text-red-500" />
                          <span>{opportunity.location}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-5 h-5 text-green-500" />
                          <span>{opportunity.contact_email}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleApply(opportunity.id)}
                        disabled={hasApplied}
                        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                          hasApplied
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white hover:shadow-lg'
                        }`}
                      >
                        {hasApplied ? (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Applied
                          </>
                        ) : (
                          <>
                            <Heart className="w-5 h-5" />
                            Apply to Volunteer
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
                Why Volunteer?
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                  <Heart className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Make an Impact</h3>
                  <p className="text-gray-600">
                    Contribute to causes that matter to you
                  </p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                  <Briefcase className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Build Skills</h3>
                  <p className="text-gray-600">
                    Gain valuable experience and abilities
                  </p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Connect</h3>
                  <p className="text-gray-600">
                    Meet like-minded people in your community
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
