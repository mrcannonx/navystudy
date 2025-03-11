import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { supabase } from './supabase';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Use the same Supabase client instance from supabase.ts
export const db = supabase;

// Admin client for administrative operations
export const adminDb = typeof window === 'undefined'
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

export async function initializeRanksTable() {
  const { error } = await adminDb.rpc('create_ranks_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.ranks (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        order INTEGER NOT NULL,
        imageUrl TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
      );

      -- Add unique constraint on order to prevent duplicate ordering
      CREATE UNIQUE INDEX IF NOT EXISTS idx_ranks_order ON public.ranks(order);

      -- Enable RLS
      ALTER TABLE public.ranks ENABLE ROW LEVEL SECURITY;

      -- Create policies
      CREATE POLICY "Everyone can view ranks"
          ON public.ranks FOR SELECT
          USING (true);

      CREATE POLICY "Only admins can insert ranks"
          ON public.ranks FOR INSERT
          WITH CHECK (auth.jwt() ->> 'isAdmin' = 'true');

      CREATE POLICY "Only admins can update ranks"
          ON public.ranks FOR UPDATE
          USING (auth.jwt() ->> 'isAdmin' = 'true');

      CREATE POLICY "Only admins can delete ranks"
          ON public.ranks FOR DELETE
          USING (auth.jwt() ->> 'isAdmin' = 'true');

      -- Add trigger for updated_at
      CREATE TRIGGER update_ranks_updated_at
          BEFORE UPDATE ON public.ranks
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `
  });

  if (error) {
    console.error('Error creating ranks table:', error);
    throw error;
  }
}
