-- The rank_code column already exists in the navy_ranks table
-- We just need to populate it with the correct values

-- Create a temporary mapping table
CREATE TEMP TABLE rank_mapping (
    id SERIAL PRIMARY KEY,
    rank_name TEXT,
    rank_code TEXT
);

-- Insert the mapping data for Navy enlisted ranks
INSERT INTO rank_mapping (rank_name, rank_code) VALUES
    ('Seaman Recruit', 'E1'),
    ('Seaman Apprentice', 'E2'),
    ('Seaman', 'E3'),
    ('Petty Officer Third Class', 'E4'),
    ('Petty Officer Second Class', 'E5'),
    ('Petty Officer First Class', 'E6'),
    ('Chief Petty Officer', 'E7'),
    ('Senior Chief Petty Officer', 'E8'),
    ('Master Chief Petty Officer', 'E9');

-- Update navy_ranks based on the mapping
-- This assumes there's a description field in navy_ranks that contains the rank name
UPDATE public.navy_ranks nr
SET rank_code = rm.rank_code
FROM rank_mapping rm
WHERE nr.description ILIKE '%' || rm.rank_name || '%';

-- Drop the temporary table
DROP TABLE rank_mapping;