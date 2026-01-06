import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  user_type: 'child' | 'adult';
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
};

export type Story = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
};

export type CommunityEvent = {
  id: string;
  organizer_id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  created_at: string;
  updated_at: string;
};

export type VideoSession = {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url?: string;
  category: 'communication' | 'sensory' | 'emotional' | 'social';
  duration_minutes: number;
  created_at: string;
};

export type MentorshipProgram = {
  id: string;
  mentor_name: string;
  specialty: string;
  description: string;
  availability: string;
  created_at: string;
};

export type VolunteeringOpportunity = {
  id: string;
  title: string;
  organization: string;
  description: string;
  location: string;
  contact_email: string;
  created_at: string;
};
