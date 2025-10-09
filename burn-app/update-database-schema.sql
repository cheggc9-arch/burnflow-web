-- Update burn_records table to include buy_signature and burn_signature columns
-- Run this in your Supabase SQL Editor

-- Add buy_signature column if it doesn't exist
ALTER TABLE public.burn_records 
ADD COLUMN IF NOT EXISTS buy_signature TEXT;

-- Add burn_signature column if it doesn't exist  
ALTER TABLE public.burn_records 
ADD COLUMN IF NOT EXISTS burn_signature TEXT;

-- Update existing records to have null values for the new columns
UPDATE public.burn_records 
SET buy_signature = NULL, burn_signature = NULL 
WHERE buy_signature IS NULL AND burn_signature IS NULL;

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'burn_records' 
AND table_schema = 'public'
ORDER BY ordinal_position;
