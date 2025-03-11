-- Add evaluation_templates table
create table if not exists public.evaluation_templates (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  rank text not null,
  rating text not null,
  role text not null,
  eval_type text not null,
  sections jsonb not null,
  brag_sheet_entries jsonb,
  is_public boolean default false
);

-- Set up row level security
alter table public.evaluation_templates enable row level security;

-- Create policy to allow users to read their own templates
create policy "Users can read their own templates"
  on public.evaluation_templates for select
  using (auth.uid() = user_id);

-- Create policy to allow users to insert their own templates
create policy "Users can insert their own templates"
  on public.evaluation_templates for insert
  with check (auth.uid() = user_id);

-- Create policy to allow users to update their own templates
create policy "Users can update their own templates"
  on public.evaluation_templates for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create policy to allow users to delete their own templates
create policy "Users can delete their own templates"
  on public.evaluation_templates for delete
  using (auth.uid() = user_id);