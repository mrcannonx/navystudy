-- Create a table for Navy ratings
CREATE TABLE IF NOT EXISTS public.navy_ratings (
  id SERIAL PRIMARY KEY,
  abbreviation TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  common_achievements TEXT[] DEFAULT '{}',
  parent_rating TEXT REFERENCES public.navy_ratings(abbreviation) ON DELETE CASCADE,
  service_rating TEXT,
  is_variation BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.navy_ratings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to navy_ratings (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'navy_ratings'
    AND policyname = 'Allow public read access to navy_ratings'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow public read access to navy_ratings"
      ON public.navy_ratings
      FOR SELECT
      USING (true)';
  END IF;
END
$$;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update the updated_at column (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_navy_ratings_updated_at'
  ) THEN
    CREATE TRIGGER update_navy_ratings_updated_at
    BEFORE UPDATE ON public.navy_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;