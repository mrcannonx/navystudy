-- Create ranks table
create table public.ranks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  imageUrl text,
  "order" integer not null
);

-- Set up row level security
alter table public.ranks enable row level security;

-- Create policy to allow anyone to read ranks
create policy "Anyone can read ranks"
  on public.ranks for select
  using (true);

-- Create policy to allow service role to modify ranks
create policy "Service role can modify ranks"
  on public.ranks for all
  using (true)
  with check (true);

-- Note: In production, you should restrict this to admin users
-- For now, we're making it more permissive for testing 