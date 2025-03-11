-- Add is_demo_mode column to evaluation_templates table
ALTER TABLE public.evaluation_templates
ADD COLUMN IF NOT EXISTS is_demo_mode boolean DEFAULT true;