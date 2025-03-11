-- Rename the chevrons table to navy_ranks
ALTER TABLE public.chevrons RENAME TO navy_ranks;

-- Update the foreign key reference in profiles table
ALTER TABLE public.profiles 
  RENAME COLUMN chevron_id TO navy_rank_id;

-- Update the foreign key constraint
ALTER TABLE public.profiles 
  DROP CONSTRAINT profiles_chevron_id_fkey;

ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_navy_rank_id_fkey 
  FOREIGN KEY (navy_rank_id) 
  REFERENCES public.navy_ranks(id);

-- Update RLS policies
DROP POLICY IF EXISTS "Anyone can read chevrons" ON public.navy_ranks;
CREATE POLICY "Anyone can read navy_ranks"
  ON public.navy_ranks FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role can modify chevrons" ON public.navy_ranks;
CREATE POLICY "Service role can modify navy_ranks"
  ON public.navy_ranks FOR ALL
  USING (true)
  WITH CHECK (true);