-- Create custom_metrics table
CREATE TABLE IF NOT EXISTS custom_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  metric TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add a unique constraint to prevent duplicate metrics for the same user and section
  UNIQUE(user_id, section, metric)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS custom_metrics_user_id_idx ON custom_metrics(user_id);
CREATE INDEX IF NOT EXISTS custom_metrics_section_idx ON custom_metrics(section);

-- Add RLS policies
ALTER TABLE custom_metrics ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select only their own metrics
CREATE POLICY select_own_metrics ON custom_metrics
  FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to insert their own metrics
CREATE POLICY insert_own_metrics ON custom_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own metrics
CREATE POLICY update_own_metrics ON custom_metrics
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy to allow users to delete their own metrics
CREATE POLICY delete_own_metrics ON custom_metrics
  FOR DELETE USING (auth.uid() = user_id);