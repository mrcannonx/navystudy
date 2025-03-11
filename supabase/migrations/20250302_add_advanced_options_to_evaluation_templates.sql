-- Add advanced options columns to evaluation_templates table

-- Personal Information
ALTER TABLE public.evaluation_templates
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS desig TEXT,
ADD COLUMN IF NOT EXISTS ssn TEXT;

-- Status Information
ALTER TABLE public.evaluation_templates
ADD COLUMN IF NOT EXISTS duty_status JSONB,
ADD COLUMN IF NOT EXISTS uic TEXT,
ADD COLUMN IF NOT EXISTS ship_station TEXT,
ADD COLUMN IF NOT EXISTS promotion_status TEXT DEFAULT 'Regular',
ADD COLUMN IF NOT EXISTS date_reported TEXT;

-- Report Information
ALTER TABLE public.evaluation_templates
ADD COLUMN IF NOT EXISTS occasion_for_report JSONB;

-- Period of Report
ALTER TABLE public.evaluation_templates
ADD COLUMN IF NOT EXISTS report_period JSONB;

-- Report Type
ALTER TABLE public.evaluation_templates
ADD COLUMN IF NOT EXISTS not_observed_report BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS report_type JSONB;

-- Additional Information
ALTER TABLE public.evaluation_templates
ADD COLUMN IF NOT EXISTS physical_readiness TEXT,
ADD COLUMN IF NOT EXISTS billet_subcategory TEXT DEFAULT 'N/A';

-- Command Information
ALTER TABLE public.evaluation_templates
ADD COLUMN IF NOT EXISTS command_employment TEXT,
ADD COLUMN IF NOT EXISTS primary_duties TEXT;

-- Counseling Information
ALTER TABLE public.evaluation_templates
ADD COLUMN IF NOT EXISTS counseling_info JSONB;