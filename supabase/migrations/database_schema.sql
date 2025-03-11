-- RankStudy Database Schema
-- Generated based on the current database structure

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  rank TEXT,
  rate TEXT,
  rate_title TEXT,
  duty_station TEXT,
  years_of_service TEXT,
  specializations TEXT,
  awards TEXT,
  chevron_id UUID REFERENCES public.chevrons(id),
  insignia_url TEXT,
  is_admin BOOLEAN DEFAULT false NOT NULL,
  email TEXT
);

-- Create ranks table
CREATE TABLE public.ranks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  imageUrl TEXT,
  "order" INTEGER NOT NULL
);

-- Create chevrons table
CREATE TABLE public.chevrons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  rank TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  active BOOLEAN DEFAULT true NOT NULL
);

-- Create insignias table
CREATE TABLE public.insignias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  rate TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  active BOOLEAN DEFAULT true NOT NULL
);

-- Create flashcards table
CREATE TABLE public.flashcards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cards JSONB NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  last_studied_at TIMESTAMP WITH TIME ZONE,
  completed_count INTEGER DEFAULT 0,
  current_cycle INTEGER DEFAULT 0,
  shown_cards_in_cycle TEXT,
  progress JSONB DEFAULT '{}'::jsonb
);

-- Create summarizer table
CREATE TABLE public.summarizer (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  format TEXT NOT NULL,
  original_text TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}'::text[]
);

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  questions JSONB NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Create study_sessions table
CREATE TABLE public.study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content_id UUID,
  content_type TEXT CHECK (content_type IN ('quiz', 'flashcard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  session_data JSONB DEFAULT '{}'::jsonb
);

-- Create user_activities table
CREATE TABLE public.user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  activity_type TEXT NOT NULL CHECK (activity_type IN ('quiz_completion', 'flashcard_study', 'content_creation')),
  content_id UUID,
  content_type TEXT CHECK (content_type IN ('quiz', 'flashcard')),
  content_title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  activity_data JSONB DEFAULT '{}'::jsonb
);

-- Create daily_active_users table
CREATE TABLE public.daily_active_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  date DATE NOT NULL,
  session_count INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_retention table
CREATE TABLE public.user_retention (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  first_seen_date DATE NOT NULL,
  last_seen_date DATE NOT NULL,
  visit_count INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create platform_usage table
CREATE TABLE public.platform_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  device_type TEXT NOT NULL,
  browser TEXT NOT NULL,
  platform TEXT NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  session_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create learning_path_progress table
CREATE TABLE public.learning_path_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  path_id UUID NOT NULL,
  current_step INTEGER DEFAULT 0 NOT NULL,
  total_steps INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create reminder_settings table
CREATE TABLE public.reminder_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email_enabled BOOLEAN DEFAULT true NOT NULL,
  notification_time TIME NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly'))
);

-- Create app_settings table (based on the diagram)
CREATE TABLE public.app_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Ranks RLS
ALTER TABLE public.ranks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read ranks"
  ON public.ranks FOR SELECT
  USING (true);
CREATE POLICY "Service role can modify ranks"
  ON public.ranks FOR ALL
  USING (true)
  WITH CHECK (true);

-- Chevrons RLS
ALTER TABLE public.chevrons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read chevrons"
  ON public.chevrons FOR SELECT
  USING (true);
CREATE POLICY "Service role can modify chevrons"
  ON public.chevrons FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insignias RLS
ALTER TABLE public.insignias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read insignias"
  ON public.insignias FOR SELECT
  USING (true);
CREATE POLICY "Service role can modify insignias"
  ON public.insignias FOR ALL
  USING (true)
  WITH CHECK (true);

-- Flashcards RLS
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own flashcards"
  ON public.flashcards FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own flashcards"
  ON public.flashcards FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own flashcards"
  ON public.flashcards FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own flashcards"
  ON public.flashcards FOR DELETE
  USING (auth.uid() = user_id);

-- Summarizer RLS
ALTER TABLE public.summarizer ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own summaries"
  ON public.summarizer FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own summaries"
  ON public.summarizer FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own summaries"
  ON public.summarizer FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own summaries"
  ON public.summarizer FOR DELETE
  USING (auth.uid() = user_id);

-- Quizzes RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own quizzes"
  ON public.quizzes FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own quizzes"
  ON public.quizzes FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quizzes"
  ON public.quizzes FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own quizzes"
  ON public.quizzes FOR DELETE
  USING (auth.uid() = user_id);

-- Study Sessions RLS
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own study sessions"
  ON public.study_sessions FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own study sessions"
  ON public.study_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own study sessions"
  ON public.study_sessions FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own study sessions"
  ON public.study_sessions FOR DELETE
  USING (auth.uid() = user_id);
CREATE POLICY "Service role can access all study sessions"
  ON public.study_sessions FOR ALL
  USING (true)
  WITH CHECK (true);

-- User Activities RLS
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own activities"
  ON public.user_activities FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own activities"
  ON public.user_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role can view all activities"
  ON public.user_activities FOR SELECT
  USING (true);

-- App Settings RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read app settings"
  ON public.app_settings FOR SELECT
  USING (true);
CREATE POLICY "Service role can modify app settings"
  ON public.app_settings FOR ALL
  USING (true)
  WITH CHECK (true);

-- Reminder Settings RLS
ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own reminder settings"
  ON public.reminder_settings FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own reminder settings"
  ON public.reminder_settings FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own reminder settings"
  ON public.reminder_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reminder settings"
  ON public.reminder_settings FOR DELETE
  USING (auth.uid() = user_id);

-- Analytics tables RLS
ALTER TABLE public.daily_active_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_retention ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_path_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can access analytics"
  ON public.daily_active_users FOR ALL
  USING (true)
  WITH CHECK (true);
CREATE POLICY "Service role can access retention data"
  ON public.user_retention FOR ALL
  USING (true)
  WITH CHECK (true);
CREATE POLICY "Service role can access platform usage"
  ON public.platform_usage FOR ALL
  USING (true)
  WITH CHECK (true);
CREATE POLICY "Users can view their own learning path progress"
  ON public.learning_path_progress FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Service role can modify learning path progress"
  ON public.learning_path_progress FOR ALL
  USING (true)
  WITH CHECK (true);