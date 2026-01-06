/*
  # Autism Community Platform Schema

  ## Overview
  This migration creates the complete database schema for an autism community platform
  serving both children and adults with distinct features for each group.

  ## New Tables

  ### 1. profiles
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `user_type` (text) - 'child' or 'adult'
  - `avatar_url` (text, nullable)
  - `bio` (text, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. stories
  - `id` (uuid, primary key)
  - `author_id` (uuid, references profiles)
  - `title` (text)
  - `content` (text)
  - `category` (text) - e.g., 'self-care', 'daily-life', 'achievements'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. story_reactions
  - `id` (uuid, primary key)
  - `story_id` (uuid, references stories)
  - `user_id` (uuid, references profiles)
  - `reaction_type` (text) - 'heart', 'support', 'inspiring'
  - `created_at` (timestamptz)

  ### 4. community_events
  - `id` (uuid, primary key)
  - `organizer_id` (uuid, references profiles)
  - `title` (text)
  - `description` (text)
  - `location` (text)
  - `event_date` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. event_rsvps
  - `id` (uuid, primary key)
  - `event_id` (uuid, references community_events)
  - `user_id` (uuid, references profiles)
  - `status` (text) - 'going', 'interested', 'not_going'
  - `created_at` (timestamptz)

  ### 6. video_sessions
  - `id` (uuid, primary key)
  - `title` (text)
  - `description` (text)
  - `video_url` (text)
  - `thumbnail_url` (text, nullable)
  - `category` (text) - 'communication', 'sensory', 'emotional', 'social'
  - `duration_minutes` (integer)
  - `created_at` (timestamptz)

  ### 7. quiz_results
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `video_id` (uuid, references video_sessions)
  - `score` (integer)
  - `completed_at` (timestamptz)

  ### 8. mentorship_programs
  - `id` (uuid, primary key)
  - `mentor_name` (text)
  - `specialty` (text)
  - `description` (text)
  - `availability` (text)
  - `created_at` (timestamptz)

  ### 9. mentorship_requests
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `program_id` (uuid, references mentorship_programs)
  - `message` (text)
  - `status` (text) - 'pending', 'accepted', 'completed'
  - `created_at` (timestamptz)

  ### 10. volunteering_opportunities
  - `id` (uuid, primary key)
  - `title` (text)
  - `organization` (text)
  - `description` (text)
  - `location` (text)
  - `contact_email` (text)
  - `created_at` (timestamptz)

  ### 11. volunteering_applications
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `opportunity_id` (uuid, references volunteering_opportunities)
  - `message` (text)
  - `status` (text) - 'pending', 'accepted', 'declined'
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Policies for authenticated users to manage their own data
  - Public read access for appropriate content
  - Restricted write access based on ownership
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('child', 'adult')),
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view stories"
  ON stories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own stories"
  ON stories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own stories"
  ON stories FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete own stories"
  ON stories FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Create story_reactions table
CREATE TABLE IF NOT EXISTS story_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type text NOT NULL CHECK (reaction_type IN ('heart', 'support', 'inspiring')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(story_id, user_id)
);

ALTER TABLE story_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reactions"
  ON story_reactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can add reactions"
  ON story_reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own reactions"
  ON story_reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create community_events table
CREATE TABLE IF NOT EXISTS community_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  event_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE community_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
  ON community_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create events"
  ON community_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update own events"
  ON community_events FOR UPDATE
  TO authenticated
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete own events"
  ON community_events FOR DELETE
  TO authenticated
  USING (auth.uid() = organizer_id);

-- Create event_rsvps table
CREATE TABLE IF NOT EXISTS event_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES community_events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('going', 'interested', 'not_going')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view RSVPs"
  ON event_rsvps FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own RSVPs"
  ON event_rsvps FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own RSVPs"
  ON event_rsvps FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own RSVPs"
  ON event_rsvps FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create video_sessions table
CREATE TABLE IF NOT EXISTS video_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text,
  category text NOT NULL CHECK (category IN ('communication', 'sensory', 'emotional', 'social')),
  duration_minutes integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE video_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view video sessions"
  ON video_sessions FOR SELECT
  TO authenticated
  USING (true);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  video_id uuid NOT NULL REFERENCES video_sessions(id) ON DELETE CASCADE,
  score integer NOT NULL,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz results"
  ON quiz_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own quiz results"
  ON quiz_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create mentorship_programs table
CREATE TABLE IF NOT EXISTS mentorship_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_name text NOT NULL,
  specialty text NOT NULL,
  description text NOT NULL,
  availability text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mentorship_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view mentorship programs"
  ON mentorship_programs FOR SELECT
  TO authenticated
  USING (true);

-- Create mentorship_requests table
CREATE TABLE IF NOT EXISTS mentorship_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES mentorship_programs(id) ON DELETE CASCADE,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mentorship_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mentorship requests"
  ON mentorship_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create mentorship requests"
  ON mentorship_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create volunteering_opportunities table
CREATE TABLE IF NOT EXISTS volunteering_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  contact_email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE volunteering_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view volunteering opportunities"
  ON volunteering_opportunities FOR SELECT
  TO authenticated
  USING (true);

-- Create volunteering_applications table
CREATE TABLE IF NOT EXISTS volunteering_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  opportunity_id uuid NOT NULL REFERENCES volunteering_opportunities(id) ON DELETE CASCADE,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE volunteering_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
  ON volunteering_applications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications"
  ON volunteering_applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);