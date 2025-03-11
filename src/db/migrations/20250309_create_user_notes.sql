-- Create user_notes table
CREATE TABLE IF NOT EXISTS user_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT,
  tags TEXT[]
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS user_notes_user_id_idx ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS user_notes_created_at_idx ON user_notes(created_at);

-- Add RLS policies
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notes
CREATE POLICY user_notes_select_policy ON user_notes
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own notes
CREATE POLICY user_notes_insert_policy ON user_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own notes
CREATE POLICY user_notes_update_policy ON user_notes
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own notes
CREATE POLICY user_notes_delete_policy ON user_notes
  FOR DELETE USING (auth.uid() = user_id);