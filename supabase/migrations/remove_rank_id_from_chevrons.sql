-- SQL script to remove the rank_id field from the chevrons table

-- First, drop the foreign key constraint
ALTER TABLE public.chevrons
DROP CONSTRAINT IF EXISTS chevrons_rank_id_fkey;

-- Then, drop the rank_id column
ALTER TABLE public.chevrons
DROP COLUMN IF EXISTS rank_id;

-- Commit the changes
COMMIT;