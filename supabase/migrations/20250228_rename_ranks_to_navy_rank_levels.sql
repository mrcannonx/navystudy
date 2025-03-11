-- Rename the ranks table to navy_rank_levels to avoid conflict with PostgreSQL rank() function
ALTER TABLE public.ranks RENAME TO navy_rank_levels;

-- Update RLS policies
DROP POLICY IF EXISTS "Anyone can read ranks" ON public.navy_rank_levels;
CREATE POLICY "Anyone can read navy_rank_levels"
  ON public.navy_rank_levels FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role can modify ranks" ON public.navy_rank_levels;
CREATE POLICY "Service role can modify navy_rank_levels"
  ON public.navy_rank_levels FOR ALL
  USING (true)
  WITH CHECK (true);