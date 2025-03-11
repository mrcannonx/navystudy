import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
}

// Admin client for server-side operations
export const adminDb = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function initializeRanksTable() {
  const sql = `
    -- Create ranks table if it doesn't exist
    CREATE TABLE IF NOT EXISTS public.ranks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      "order" INTEGER NOT NULL,
      description TEXT,
      image_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      CONSTRAINT unique_rank_name UNIQUE(name),
      CONSTRAINT unique_rank_order UNIQUE("order")
    );

    -- Add unique constraint on order to prevent duplicate ordering
    CREATE UNIQUE INDEX IF NOT EXISTS idx_ranks_order ON public.ranks("order");

    -- Enable RLS
    ALTER TABLE public.ranks ENABLE ROW LEVEL SECURITY;

    -- Modify profiles table to properly reference ranks
    ALTER TABLE public.profiles 
    DROP COLUMN IF EXISTS rank;

    ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS rank_id UUID REFERENCES public.ranks(id);

    -- Handle existing imageUrl column migration
    DO $$ 
    BEGIN
      -- Rename imageUrl to image_url if it exists
      IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'ranks' 
        AND column_name = 'imageurl'
      ) THEN
        ALTER TABLE public.ranks RENAME COLUMN imageUrl TO image_url;
      END IF;
    END $$;

    -- Create policies
    DO $$ 
    BEGIN
      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS "Everyone can view ranks" ON public.ranks;
      DROP POLICY IF EXISTS "Only admins can insert ranks" ON public.ranks;
      DROP POLICY IF EXISTS "Only admins can update ranks" ON public.ranks;
      DROP POLICY IF EXISTS "Only admins can delete ranks" ON public.ranks;
      
      -- Create new policies
      CREATE POLICY "Everyone can view ranks"
        ON public.ranks FOR SELECT
        USING (true);

      CREATE POLICY "Only admins can insert ranks"
        ON public.ranks FOR INSERT
        WITH CHECK ((auth.jwt() ->> 'isAdmin')::boolean = true);

      CREATE POLICY "Only admins can update ranks"
        ON public.ranks FOR UPDATE
        USING ((auth.jwt() ->> 'isAdmin')::boolean = true);

      CREATE POLICY "Only admins can delete ranks"
        ON public.ranks FOR DELETE
        USING ((auth.jwt() ->> 'isAdmin')::boolean = true);
    END $$;

    -- Create or replace the update_updated_at_column function
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = TIMEZONE('utc'::text, NOW());
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Add trigger for updated_at
    DROP TRIGGER IF EXISTS update_ranks_updated_at ON public.ranks;
    CREATE TRIGGER update_ranks_updated_at
      BEFORE UPDATE ON public.ranks
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `;

  // Initialize storage bucket
  try {
    const { data: buckets } = await adminDb.storage.listBuckets();
    const rankImagesBucket = buckets?.find(b => b.name === 'rank_images');
    
    if (!rankImagesBucket) {
      console.log("[DB_INIT] Creating rank_images bucket");
      const { error: createBucketError } = await adminDb.storage.createBucket('rank_images', {
        public: true,
        fileSizeLimit: '2MB',
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      });

      if (createBucketError) {
        console.error("[DB_INIT] Failed to create bucket:", createBucketError);
        throw createBucketError;
      }

      // Make bucket public
      const { error: policyError } = await adminDb.storage.updateBucket('rank_images', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        fileSizeLimit: '2MB'
      });

      if (policyError) {
        console.error("[DB_INIT] Failed to set bucket policy:", policyError);
        throw policyError;
      }
    }
  } catch (error) {
    console.error("[DB_INIT] Storage initialization error:", error);
    throw error;
  }

  const { error } = await adminDb.from("navy_rank_levels").select('*').limit(1);
  if (error && error.code === '42P01') { // Table doesn't exist
    const { error: createError } = await adminDb.rpc('exec_sql', { sql });
    if (createError) {
      console.error('Error creating ranks table:', createError);
      throw createError;
    }
  } else if (error) {
    console.error('Error checking ranks table:', error);
    throw error;
  }
} 